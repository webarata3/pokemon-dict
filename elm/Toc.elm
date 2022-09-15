module Toc exposing (..)

import AppConfig
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as JD exposing (Decoder, decodeString, field, string)



-- MODEL


type alias Link =
    { link : String
    , image : String
    }


decodeLink : Decoder Link
decodeLink =
    JD.map2 Link
        (field "link" string)
        (field "image" string)


type alias WorkTab =
    { title : String
    , maybeWebSite : Maybe String
    , maybeGitHub : Maybe String
    , contentType : String
    , techItems : List String
    , content : List (Html Msg)
    }


type alias Model =
    { links : List Link
    }


type Msg
    = GotPokemonList (Result Http.Error String)



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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



-- FUNCTIONS


getPokemonList : Cmd Msg
getPokemonList =
    Http.get
        { url = AppConfig.getBaseUrl "/api/pokemon-list.json"
        , expect = Http.expectString GotPokemonList
        }



-- VIEW


viewPokemonList : Model -> Html Msg
viewPokemonList model =
    div [ class "pokemon__list" ] <|
        List.map viewPokemonLink model.links


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
