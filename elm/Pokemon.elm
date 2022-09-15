module Pokemon exposing (..)

import ActualStatus as AS
import AppConfig as AC
import Array
import Browser exposing (Document)
import Browser.Navigation as Nav
import Dict exposing (Dict)
import Evolution as Evo
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http exposing (..)
import Json.Decode as JD exposing (Decoder, decodeString, field, int, nullable, string)
import Json.Decode.Pipeline as JDP exposing (required)
import MainPic
import Task
import Toc
import Url
import Url.Parser as Parser exposing ((</>), (<?>))
import Url.Parser.Query as Query



-- MAIN


decodeStatus : Decoder AC.Status
decodeStatus =
    JD.map6 AC.Status
        (field "hp" int)
        (field "attack" int)
        (field "defence" int)
        (field "spAttack" int)
        (field "spDefence" int)
        (field "speed" int)


decodePokemonData : Decoder AC.PokemonData
decodePokemonData =
    JD.succeed AC.PokemonData
        |> JDP.required "no" int
        |> JDP.required "form" (nullable string)
        |> JDP.required "name" string
        |> JDP.required "formName" (nullable string)
        |> JDP.required "status" decodeStatus
        |> JDP.required "evolution" (JD.list string)


type alias PokemonNo =
    ( Maybe Int, Maybe String )


type Route
    = Pokemon (Maybe Int)
    | PokemonForm (Maybe Int) (Maybe String)


routeParser : Parser.Parser (Route -> a) a
routeParser =
    Parser.oneOf
        [ Parser.map PokemonForm
            (Parser.s "pokemon.html"
                <?> Query.int "no"
                <?> Query.string "form"
            )
        , Parser.map Pokemon
            (Parser.s "pokemon.html"
                <?> Query.int "no"
            )
        ]


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , url : Url.Url
    , currentPage : Route
    , maybeCurrentPokemonNo : Maybe PokemonNo
    , tocModel : Toc.Model
    , mainPicModel : MainPic.Model
    , evolutionModel : Evo.Model
    , actualStatusModel : AS.Model
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , url = url
      , currentPage = Pokemon (Just 1)
      , maybeCurrentPokemonNo = Nothing
      , tocModel =
            { links = []
            }
      , mainPicModel =
            { maybePokemonId = Nothing
            }
      , evolutionModel =
            { maybePokemonData = Nothing
            , pokemonDataDict = Dict.empty
            }
      , actualStatusModel =
            { maybeStatus = Nothing
            , inputLevel = 50
            , inputIndividualValue = 31
            , inputEffortValue = 252
            , inputNature = AS.Good
            }
      }
    , Cmd.batch
        [ Toc.getPokemonList |> Cmd.map TocMsg
        , Task.perform (always <| UrlChanged url) <| Task.succeed ()
        ]
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | GotPokemonData (Result Http.Error String)
    | GotPokemonStatus (Result Http.Error String)
    | TocMsg Toc.Msg
    | ActualStatusMsg AS.Msg



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            case urlToRoute url of
                Pokemon no ->
                    ( { model
                        | url = url
                        , currentPage = Pokemon no
                        , maybeCurrentPokemonNo = Just ( no, Nothing )
                      }
                    , getPokemonData ( no, Nothing )
                    )

                PokemonForm no form ->
                    ( { model
                        | url = url
                        , currentPage = PokemonForm no form
                        , maybeCurrentPokemonNo = Just ( no, form )
                      }
                    , getPokemonData ( no, form )
                    )

        GotPokemonData (Ok resp) ->
            let
                pokemonDataResult =
                    decodeString decodePokemonData resp
            in
            case pokemonDataResult of
                Ok pokemonData ->
                    let
                        evolutionModel =
                            model.evolutionModel

                        newEvolutionModel =
                            { evolutionModel
                                | maybePokemonData = Just pokemonData
                            }

                        actualStatusModel =
                            model.actualStatusModel

                        newActualStatusModel =
                            { actualStatusModel
                                | maybeStatus = Just pokemonData.status
                            }
                    in
                    ( { model
                        | mainPicModel =
                            { maybePokemonId = Just <| pokemonDataToId pokemonData
                            }
                        , evolutionModel = newEvolutionModel
                        , actualStatusModel = newActualStatusModel
                      }
                    , List.map getPokemonStatus pokemonData.evolution
                        |> Cmd.batch
                    )

                Err _ ->
                    ( model, Cmd.none )

        GotPokemonData (Err _) ->
            ( model, Cmd.none )

        GotPokemonStatus (Ok resp) ->
            let
                pokemonDataResult =
                    decodeString decodePokemonData resp
            in
            case pokemonDataResult of
                Ok pokemonData ->
                    let
                        evolutionModel =
                            model.evolutionModel

                        newEvolutionModel =
                            { evolutionModel
                                | pokemonDataDict =
                                    Dict.insert
                                        (AC.pokemonDataToId pokemonData)
                                        pokemonData
                                        evolutionModel.pokemonDataDict
                            }
                    in
                    ( { model
                        | evolutionModel = newEvolutionModel
                      }
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

        GotPokemonStatus (Err _) ->
            ( model, Cmd.none )

        TocMsg msg_ ->
            let
                ( m_, cmd ) =
                    Toc.update msg_ model.tocModel
            in
            ( { model | tocModel = m_ }, Cmd.map TocMsg cmd )

        ActualStatusMsg msg_ ->
            let
                ( m_, cmd ) =
                    AS.update msg_ model.actualStatusModel
            in
            ( { model | actualStatusModel = m_ }, Cmd.map ActualStatusMsg cmd )



-- FUNCTIONS


urlToRoute : Url.Url -> Route
urlToRoute url =
    Maybe.withDefault (Pokemon (Just 1)) (Parser.parse routeParser url)


getPokemonData : PokemonNo -> Cmd Msg
getPokemonData pokemonNo =
    let
        no =
            Tuple.first pokemonNo
                |> Maybe.withDefault -1
                |> String.fromInt

        form =
            Tuple.second pokemonNo
                |> Maybe.map (\e -> "-" ++ e)
                |> Maybe.withDefault ""
    in
    Http.get
        { url = AC.getBaseUrl <| "/api/pokemon/" ++ no ++ form ++ ".json"
        , expect = Http.expectString GotPokemonData
        }


getPokemonStatus : String -> Cmd Msg
getPokemonStatus pokemon =
    Http.get
        { url = AC.getBaseUrl <| "/api/pokemon/" ++ pokemon ++ ".json"
        , expect = Http.expectString GotPokemonStatus
        }


pokemonDataToId : AC.PokemonData -> MainPic.PokemonId
pokemonDataToId pokemonData =
    { no = pokemonData.no
    , maybeForm = pokemonData.maybeForm
    , name = pokemonData.name
    , formName = ""
    }



-- VIEW


view : Model -> Document Msg
view model =
    let
        pageTitle =
            case model.currentPage of
                Pokemon no ->
                    "pokemon"

                PokemonForm no form ->
                    "no"

        pokemonNo =
            case model.currentPage of
                Pokemon maybeNo ->
                    ( maybeNo, Nothing )

                PokemonForm maybeNo maybeForm ->
                    ( maybeNo, maybeForm )
    in
    { title = pageTitle
    , body =
        [ viewMain model pokemonNo
        ]
    }


viewMain : Model -> PokemonNo -> Html Msg
viewMain model pokemonNo =
    case model.evolutionModel.maybePokemonData of
        Just pokemonData ->
            main_ [ class "main" ]
                [ Toc.viewPokemonList model.tocModel |> Html.map TocMsg
                , viewPokemonMain model pokemonNo pokemonData
                ]

        _ ->
            main_ [ class "main" ]
                [ Toc.viewPokemonList model.tocModel |> Html.map TocMsg
                , div [] []
                ]


viewPokemonMain : Model -> PokemonNo -> AC.PokemonData -> Html Msg
viewPokemonMain model pokemonNo pokemonData =
    div []
        [ MainPic.viewPokemonMainPic model.mainPicModel
        , viewStatusInfo pokemonData model
        ]


viewStatusInfo : AC.PokemonData -> Model -> Html Msg
viewStatusInfo pokemonData model =
    div [ class "pokemon__detail" ]
        [ Evo.viewPokemonEvolution model.evolutionModel
        , AS.viewActualStatus model.actualStatusModel
            |> Html.map ActualStatusMsg
        ]
