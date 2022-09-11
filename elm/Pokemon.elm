module Pokemon exposing (..)

import Array
import Browser exposing (Document)
import Browser.Navigation as Nav
import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http exposing (..)
import Json.Decode as JD exposing (Decoder, decodeString, field, int, nullable, string)
import Json.Decode.Pipeline as JDP exposing (required)
import Task
import Url
import Url.Parser as Parser exposing ((</>), (<?>))
import Url.Parser.Query as Query



-- MAIN


type alias PokemonNo =
    ( Maybe Int, Maybe String )


type alias Link =
    { link : String
    , image : String
    }


decodeLink : Decoder Link
decodeLink =
    JD.map2 Link
        (field "link" string)
        (field "image" string)


type alias PokemonData =
    { no : Int
    , maybeForm : Maybe String
    , name : String
    , hp : Int
    , attack : Int
    , defence : Int
    , spAttack : Int
    , spDefence : Int
    , speed : Int
    , evolution : List String
    }


decodePokemonData : Decoder PokemonData
decodePokemonData =
    JD.succeed PokemonData
        |> JDP.required "no" int
        |> JDP.required "form" (nullable string)
        |> JDP.required "name" string
        |> JDP.required "hp" int
        |> JDP.required "attack" int
        |> JDP.required "defence" int
        |> JDP.required "spAttack" int
        |> JDP.required "spDefence" int
        |> JDP.required "speed" int
        |> JDP.required "evolution" (JD.list string)


type Route
    = Pokemon (Maybe Int)
    | PokemonForm (Maybe Int) (Maybe String)


type Nature
    = Good
    | Normal
    | Bad


type alias Correction =
    { kotai : Int
    , doryoku : Int
    , nature : Nature
    }


routeParser : Parser.Parser (Route -> a) a
routeParser =
    Parser.oneOf
        [ Parser.map Pokemon
            (Parser.s "pokemon.html"
                <?> Query.int "no"
            )
        , Parser.map PokemonForm
            (Parser.s "pokemon.html"
                <?> Query.int "no"
                <?> Query.string "form"
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
    , links : List Link
    , maybePokemonData : Maybe PokemonData
    , pokemonStatusDict : Dict String PokemonData
    , inputLevel : Int
    , inputKotai : Int
    , inputDoryoku : Int
    , inputNature : Nature
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , url = url
      , currentPage = Pokemon (Just 1)
      , maybeCurrentPokemonNo = Nothing
      , links = []
      , maybePokemonData = Nothing
      , pokemonStatusDict = Dict.empty
      , inputLevel = 50
      , inputKotai = 31
      , inputDoryoku = 252
      , inputNature = Good
      }
    , Cmd.batch
        [ getPokemonList
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
    | GotPokemonList (Result Http.Error String)
    | GotPokemonData (Result Http.Error String)
    | GotPokemonStatus (Result Http.Error String)
    | InputLevel String
    | ClickKotai Int
    | ClickDoryoku Int
    | ClickNature Nature



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

        GotPokemonList (Ok resp) ->
            let
                linksResult =
                    decodeString (JD.list decodeLink) resp
            in
            case linksResult of
                Ok links ->
                    ( { model | links = links }
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

        GotPokemonList (Err _) ->
            ( model, Cmd.none )

        GotPokemonData (Ok resp) ->
            let
                pokemonDataResult =
                    decodeString decodePokemonData resp
            in
            case pokemonDataResult of
                Ok pokemonData ->
                    ( { model | maybePokemonData = Just pokemonData }
                    , List.map getPokemonStatus pokemonData.evolution
                        |> Cmd.batch
                    )

                Err _ ->
                    ( model, Cmd.none )

        GotPokemonData (Err _) ->
            ( model, Cmd.none )

        GotPokemonStatus (Ok resp) ->
            let
                a =
                    Debug.log "" resp

                pokemonDataResult =
                    decodeString decodePokemonData resp
            in
            case pokemonDataResult of
                Ok pokemonData ->
                    ( { model
                        | pokemonStatusDict =
                            Dict.insert
                                (pokemonDataToNo pokemonData)
                                pokemonData
                                model.pokemonStatusDict
                      }
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

        GotPokemonStatus (Err _) ->
            ( model, Cmd.none )

        InputLevel value ->
            case String.toInt value of
                Just level ->
                    let
                        inputLevel =
                            if level < 1 then
                                1

                            else if level > 100 then
                                100

                            else
                                level
                    in
                    ( { model | inputLevel = inputLevel }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ClickKotai kotai ->
            ( { model | inputKotai = kotai }, Cmd.none )

        ClickDoryoku doryoku ->
            ( { model | inputDoryoku = doryoku }, Cmd.none )

        ClickNature nature ->
            ( { model | inputNature = nature }, Cmd.none )



-- FUNCTIONS


getBaseUrl : String -> String
getBaseUrl suffix =
    suffix


urlToRoute : Url.Url -> Route
urlToRoute url =
    Maybe.withDefault (Pokemon (Just 1)) (Parser.parse routeParser url)


getPokemonData : PokemonNo -> Cmd Msg
getPokemonData pokemonNo =
    let
        no =
            getPokemonNoString pokemonNo
    in
    Http.get
        { url = getBaseUrl <| "/api/pokemon/" ++ no ++ ".json"
        , expect = Http.expectString GotPokemonData
        }


getPokemonStatus : String -> Cmd Msg
getPokemonStatus pokemon =
    Http.get
        { url = getBaseUrl <| "/api/pokemon/" ++ pokemon ++ ".json"
        , expect = Http.expectString GotPokemonStatus
        }


getPokemonList : Cmd Msg
getPokemonList =
    Http.get
        { url = getBaseUrl "/api/pokemon-list.json"
        , expect = Http.expectString GotPokemonList
        }


getPokemonNoString : PokemonNo -> String
getPokemonNoString pokemonNo =
    Tuple.first pokemonNo
        |> Maybe.withDefault -1
        |> String.fromInt


pokemonDataToNo : PokemonData -> String
pokemonDataToNo pokemonData =
    let
        no =
            String.fromInt pokemonData.no
    in
    case pokemonData.maybeForm of
        Just form ->
            no ++ "-" ++ form

        Nothing ->
            no


calcHp : Int -> Int -> Int -> Int -> Int
calcHp shuzoku kotai doryoku lv =
    (shuzoku * 2 + kotai + doryoku // 4) * lv // 100 + lv + 10


calcParam : Int -> Int -> Int -> Int -> Nature -> Int
calcParam shuzoku kotai doryoku lv nature =
    let
        value =
            case nature of
                Good ->
                    1.1

                Normal ->
                    1.0

                Bad ->
                    0.9
    in
    (((shuzoku * 2 + kotai + doryoku // 4) * lv // 100 + 5)
        |> toFloat
    )
        * value
        |> truncate



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
    case model.maybePokemonData of
        Just pokemonData ->
            main_ [ class "main" ]
                [ viewPokemonList model.links
                , viewPokemonMain model pokemonNo pokemonData
                ]

        _ ->
            main_ [ class "main" ]
                [ viewPokemonList model.links
                , div [] []
                ]


viewPokemonList : List Link -> Html Msg
viewPokemonList links =
    div [ class "pokemon__list" ] <|
        List.map viewPokemonLink links


viewPokemonLink : Link -> Html Msg
viewPokemonLink link =
    a [ href link.link ]
        [ img
            [ src link.image
            , attribute "loading" "lazy"
            , class "pokemon__link"
            ]
            []
        ]


viewPokemonMain : Model -> PokemonNo -> PokemonData -> Html Msg
viewPokemonMain model pokemonNo pokemonData =
    div []
        [ section [ class "pokemon__info" ]
            [ viewToc pokemonData pokemonNo
            , viewPokemonImage pokemonNo
            ]
        , viewStatusInfo pokemonData model
        ]


viewToc : PokemonData -> PokemonNo -> Html Msg
viewToc pokemonData pokemonNo =
    let
        no =
            Tuple.first pokemonNo
                |> Maybe.withDefault -1

        before =
            if no == 1 then
                div [] []

            else
                div [ class "arrow-left" ]
                    [ a
                        [ href <| getBaseUrl "/pokemon.html?no=" ++ String.fromInt (no - 1)
                        , class "main__link-head"
                        ]
                        [ img
                            [ src <| getBaseUrl ("/image/pokemon/" ++ String.fromInt (no - 1) ++ ".png")
                            , class "pokemon__image-toc"
                            ]
                            []
                        , img
                            [ src <| getBaseUrl "/image/arrow-left-long-solid.svg"
                            , class "arrow"
                            ]
                            []
                        ]
                    ]

        after =
            if no == 905 then
                div [] []

            else
                a
                    [ href <| getBaseUrl "/pokemon.html?no=" ++ String.fromInt (no + 1)
                    , class "main__link-head"
                    ]
                    [ div [ class "arrow-right" ]
                        [ img
                            [ src <| getBaseUrl ("/image/pokemon/" ++ String.fromInt (no + 1) ++ ".png")
                            , class "pokemon__image-toc"
                            ]
                            []
                        , img
                            [ src <| getBaseUrl "/image/arrow-right-long-solid.svg"
                            , class "arrow"
                            ]
                            []
                        ]
                    ]
    in
    div [ class "pokemon__toc" ]
        [ before
        , div [ class "pokemon__title" ]
            [ h1 [ class "pokemon__name" ]
                [ text <| "No." ++ String.fromInt no ++ " " ++ pokemonData.name ]
            ]
        , after
        ]


viewPokemonImage : PokemonNo -> Html Msg
viewPokemonImage pokemonNo =
    let
        no =
            Tuple.first pokemonNo
                |> Maybe.withDefault -1

        form =
            Tuple.second pokemonNo
                |> Maybe.map (\v -> "-" ++ v)
                |> Maybe.withDefault ""
    in
    div [ class "pokemon__image-large" ]
        [ img
            [ src <| getBaseUrl ("/image/pokemon/" ++ String.fromInt no ++ form ++ ".png")
            , class "pokemon__image-main"
            ]
            []
        ]


viewStatusInfo : PokemonData -> Model -> Html Msg
viewStatusInfo pokemonData model =
    div [ class "pokemon__detail" ]
        [ viewPokemonEvolution pokemonData model.pokemonStatusDict
        , viewIndividualValue pokemonData model
        ]


viewPokemonEvolution : PokemonData -> Dict String PokemonData -> Html Msg
viewPokemonEvolution pokemonData pokemonStatusDict =
    let
        no =
            pokemonDataToNo pokemonData
    in
    section [ class "pokemon__evolution" ]
        [ h2 [ class "main__sub-title" ] [ text "進化と種族値" ]
        , table []
            [ thead []
                [ tr [] <|
                    th [ class "main__th" ] []
                        :: List.map (viewEvoHeaderImage pokemonStatusDict no) pokemonData.evolution
                , tr [] <|
                    th [ class "main__th" ] []
                        :: List.map (viewEvoHeaderName pokemonStatusDict no) pokemonData.evolution
                ]
            , tbody [] <|
                List.map2 (viewEvoStatusLine pokemonStatusDict pokemonData.evolution no)
                    [ "HP", "こうげき", "ぼうぎょ", "とくこう", "とくぼう", "すばやさ" ]
                    [ .hp, .attack, .defence, .spAttack, .spDefence, .speed ]
            ]
        ]


viewEvoHeaderImage : Dict String PokemonData -> String -> String -> Html Msg
viewEvoHeaderImage pokemonStatusDict no pokemonId =
    case Dict.get pokemonId pokemonStatusDict of
        Just pokemonStatus ->
            td
                [ classList
                    [ ( "main__td", True )
                    , ( "main__td-selected main__td-selected-top", no == pokemonId )
                    ]
                ]
                [ img
                    [ src
                        ("/image/pokemon/"
                            ++ pokemonDataToNo pokemonStatus
                            ++ ".png"
                        )
                    , class "pokemon__image-evo"
                    ]
                    []
                ]

        _ ->
            td [ class "main__td" ] []


viewEvoHeaderName : Dict String PokemonData -> String -> String -> Html Msg
viewEvoHeaderName pokemonStatusDict no pokemonId =
    case Dict.get pokemonId pokemonStatusDict of
        Just pokemonStatus ->
            th
                [ classList
                    [ ( "main__td", True )
                    , ( "main__td-selected", no == pokemonId )
                    ]
                ]
                [ text pokemonStatus.name ]

        _ ->
            th [ class "main__th" ] [ text "読込中" ]


viewEvoStatusLine : Dict String PokemonData -> List String -> String -> String -> (PokemonData -> Int) -> Html Msg
viewEvoStatusLine pokemonStatusDict evolution no title f =
    tr [] <|
        th [ class "main__th main__th-center" ] [ text title ]
            :: List.map (viewEvoStatus pokemonStatusDict no f (title == "すばやさ")) evolution


viewEvoStatus : Dict String PokemonData -> String -> (PokemonData -> Int) -> Bool -> String -> Html Msg
viewEvoStatus pokemonStatusDict no f isLast pokemonId =
    case Dict.get pokemonId pokemonStatusDict of
        Just pokemonStatus ->
            td
                [ classList
                    [ ( "main__td", True )
                    , ( "main__td-status", True )
                    , ( "main__td-selected", no == pokemonId )
                    , ( "main__td-selected-bottom", (no == pokemonId) && isLast )
                    ]
                ]
                [ div [ class "main__td-status-value" ]
                    [ f pokemonStatus |> String.fromInt |> text ]
                ]

        _ ->
            td [ class "main__td" ] [ text "" ]


viewIndividualValue : PokemonData -> Model -> Html Msg
viewIndividualValue pokemonData model =
    section [ class "pokemon__value" ]
        [ h2 [ class "main__sub-title" ] [ text "実数値詳細" ]
        , div []
            [ label [ for "level", class "main__label" ] [ text "LV" ]
            , input
                [ type_ "number"
                , id "level"
                , value <| String.fromInt model.inputLevel
                , onInput InputLevel
                , class "main__input-level"
                ]
                []
            , viewIndividual pokemonData model
            ]
        ]


viewIndividual : PokemonData -> Model -> Html Msg
viewIndividual pokemonData model =
    table []
        [ viewIndividualHead model
        , tbody [] <|
            List.map2
                (viewCalcStatusRow
                    pokemonData
                    [ { kotai = 31
                      , doryoku = 252
                      , nature = Good
                      }
                    , { kotai = 31
                      , doryoku = 0
                      , nature = Good
                      }
                    , { kotai = 31
                      , doryoku = 0
                      , nature = Normal
                      }
                    , { kotai = model.inputKotai
                      , doryoku = model.inputDoryoku
                      , nature = model.inputNature
                      }
                    ]
                    model.inputLevel
                )
                [ "HP", "こうげき", "ぼうぎょ", "とくこう", "とくぼう", "すばやさ" ]
                [ .hp, .attack, .defence, .spAttack, .spDefence, .speed ]
        ]


viewIndividualHead : Model -> Html Msg
viewIndividualHead model =
    thead []
        [ tr []
            [ th [ class "main__th" ] [ text "個体値" ]
            , th [ class "main__th pokemon__label" ] [ text "最大" ]
            , th [ class "main__th pokemon__label" ] [ text "最大" ]
            , th [ class "main__th pokemon__label" ] [ text "最大" ]
            , th [ class "main__th main__radio-area main__radio-area-2" ]
                [ input
                    [ type_ "radio"
                    , id "kotai-max"
                    , name "kotai"
                    , class "main__radio"
                    , checked <| model.inputKotai == 31
                    , onClick <| ClickKotai 31
                    ]
                    []
                , label
                    [ for "kotai-max"
                    , class "main__radio-label"
                    ]
                    [ text "最大" ]
                , input
                    [ type_ "radio"
                    , id "kotai-min"
                    , name "kotai"
                    , class "main__radio"
                    , checked <| model.inputKotai == 0
                    , onClick <| ClickKotai 0
                    ]
                    []
                , label
                    [ for "kotai-min"
                    , class "main__radio-label"
                    ]
                    [ text "0" ]
                ]
            ]
        , tr []
            [ th [ class "main__th" ] [ text "努力値" ]
            , th [ class "main__th pokemon__label" ] [ text "最大" ]
            , th [ class "main__th pokemon__label" ] [ text "0" ]
            , th [ class "main__th pokemon__label" ] [ text "0" ]
            , th [ class "main__th main__radio-area main__radio-area-2" ]
                [ input
                    [ type_ "radio"
                    , id "doryoku-max"
                    , name "doryoku"
                    , class "main__radio"
                    , checked <| model.inputDoryoku == 252
                    , onClick <| ClickDoryoku 252
                    ]
                    []
                , label
                    [ for "doryoku-max"
                    , class "main__radio-label"
                    ]
                    [ text "最大" ]
                , input
                    [ type_ "radio"
                    , id "doryoku-min"
                    , name "doryoku"
                    , class "main__radio"
                    , checked <| model.inputDoryoku == 0
                    , onClick <| ClickDoryoku 0
                    ]
                    []
                , label
                    [ for "doryoku-min"
                    , class "main__radio-label"
                    ]
                    [ text "0" ]
                ]
            ]
        , tr []
            [ th [ class "main__th" ] [ text "性格補正" ]
            , th [ class "main__th pokemon__label" ] [ text "+" ]
            , th [ class "main__th pokemon__label" ] [ text "+" ]
            , th [ class "main__th pokemon__label" ] [ text "無" ]
            , th [ class "main__th main__radio-area main__radio-area-3" ]
                [ input
                    [ type_ "radio"
                    , id "nature-max"
                    , name "nature"
                    , class "main__radio"
                    , checked <| model.inputNature == Good
                    , onClick <| ClickNature Good
                    ]
                    []
                , label
                    [ for "nature-max"
                    , class "main__radio-label"
                    ]
                    [ text "+" ]
                , input
                    [ type_ "radio"
                    , id "nature-zero"
                    , name "nature"
                    , class "main__radio"
                    , checked <| model.inputNature == Normal
                    , onClick <| ClickNature Normal
                    ]
                    []
                , label
                    [ for "nature-zero"
                    , class "main__radio-label"
                    ]
                    [ text "無" ]
                , input
                    [ type_ "radio"
                    , id "nature-min"
                    , name "nature"
                    , class "main__radio"
                    , checked <| model.inputNature == Bad
                    , onClick <| ClickNature Bad
                    ]
                    []
                , label
                    [ for "nature-min"
                    , class "main__radio-label"
                    ]
                    [ text "-" ]
                ]
            ]
        ]


viewCalcStatusRow : PokemonData -> List Correction -> Int -> String -> (PokemonData -> Int) -> Html Msg
viewCalcStatusRow pokemonData corrections inputLevel title f =
    tr [] <|
        th [ class "main__th main__th-center" ] [ text title ]
            :: List.map (viewCalcStatus pokemonData inputLevel (title == "HP") f) corrections


viewCalcStatus : PokemonData -> Int -> Bool -> (PokemonData -> Int) -> Correction -> Html Msg
viewCalcStatus pokemonData inputLevel isHp f correction =
    let
        value =
            if isHp then
                String.fromInt
                    (calcHp (f pokemonData)
                        correction.kotai
                        correction.doryoku
                        inputLevel
                    )

            else
                String.fromInt
                    (calcParam (f pokemonData)
                        correction.kotai
                        correction.doryoku
                        inputLevel
                        correction.nature
                    )
    in
    td [ class "main__td number" ] [ text value ]
