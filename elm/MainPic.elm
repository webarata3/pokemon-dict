module MainPic exposing (..)

import AppConfig
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


type alias PokemonId =
    { no : Int
    , maybeForm : Maybe String
    , name : String
    , maybeFormName : Maybe String
    }


type alias Model =
    { maybePokemonId : Maybe PokemonId
    }



-- FUNCTION


getTocUrl : Int -> String
getTocUrl no =
    AppConfig.getBaseUrl "/pokemon.html?no=" ++ String.fromInt no


getTocImageUrl : Int -> String
getTocImageUrl no =
    AppConfig.getBaseUrl ("/image/pokemon/" ++ String.fromInt no ++ ".webp")



-- VIEW


viewPokemonMainPic : Model -> Html msg
viewPokemonMainPic model =
    case model.maybePokemonId of
        Just pokemonId ->
            section [ class "pokemon__info" ]
                [ viewToc pokemonId
                , viewPokemonImage pokemonId
                ]

        _ ->
            section [ class "pokemon__info" ] []


viewToc : PokemonId -> Html msg
viewToc pokemonId =
    let
        before =
            if pokemonId.no == 1 then
                div [] []

            else
                div [ class "arrow-left" ]
                    [ a
                        [ href <| getTocUrl (pokemonId.no - 1)
                        , class "main__link-head"
                        ]
                        [ img
                            [ src <| getTocImageUrl (pokemonId.no - 1)
                            , width 50
                            , height 50
                            ]
                            []
                        , img
                            [ src <|
                                AppConfig.getBaseUrl "/image/arrow-left-long-solid.svg"
                            , class "arrow"
                            ]
                            []
                        ]
                    ]

        after =
            if pokemonId.no == 905 then
                div [] []

            else
                a
                    [ href <| getTocUrl (pokemonId.no + 1)
                    , class "main__link-head"
                    ]
                    [ div [ class "arrow-right" ]
                        [ img
                            [ src <| getTocImageUrl (pokemonId.no + 1)
                            , width 50
                            , height 50
                            ]
                            []
                        , img
                            [ src <|
                                AppConfig.getBaseUrl "/image/arrow-right-long-solid.svg"
                            , class "arrow"
                            ]
                            []
                        ]
                    ]
    in
    div [ class "pokemon__toc" ]
        [ before
        , div [ class "pokemon__title" ] <|
            List.concat
                [ [ h1 [] [ text <| "No." ++ String.fromInt pokemonId.no ] ]
                , [ h1 [] [ text pokemonId.name ] ]
                , case pokemonId.maybeFormName of
                    Just formName ->
                        [ div [] []
                        , h1 [] [ text formName ]
                        ]

                    _ ->
                        []
                ]
        , after
        ]


viewPokemonImage : PokemonId -> Html msg
viewPokemonImage pokemonId =
    let
        id =
            AppConfig.pokemonNoFormToId pokemonId.no pokemonId.maybeForm
    in
    div [ class "main__pic" ]
        [ img
            [ src <| AppConfig.getBaseUrl ("/image/pokemon/" ++ id ++ ".webp")
            , width 300
            , height 300
            ]
            []
        ]
