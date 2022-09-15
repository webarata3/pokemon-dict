module Evolution exposing (..)

import AppConfig
import Dict exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


type alias Model =
    { maybePokemonData : Maybe AppConfig.PokemonData
    , pokemonDataDict : Dict String AppConfig.PokemonData
    }



-- VIEW


viewPokemonEvolution : Model -> Html msg
viewPokemonEvolution model =
    case model.maybePokemonData of
        Just pokemonData ->
            viewPokemonEvolutionMain model pokemonData

        _ ->
            section [ class "pokemon__evolution" ] []


viewPokemonEvolutionMain : Model -> AppConfig.PokemonData -> Html msg
viewPokemonEvolutionMain model pokemonData =
    let
        id =
            AppConfig.pokemonDataToId pokemonData
    in
    section [ class "pokemon__evolution" ]
        [ h2 [ class "main__sub-title" ] [ text "進化と種族値" ]
        , div [ class "pokemon__evolution-table" ]
            [ table [ class "main__table" ]
                [ thead []
                    [ tr [] <|
                        th [ class "main__th" ] []
                            :: List.map (viewEvoHeaderImage model.pokemonDataDict id) pokemonData.evolution
                    , tr [] <|
                        th [ class "main__th" ] []
                            :: List.map (viewEvoHeaderName model.pokemonDataDict id) pokemonData.evolution
                    ]
                , tbody [] <|
                    List.map2 (viewEvoStatusLine model.pokemonDataDict pokemonData.evolution id)
                        [ "HP", "こうげき", "ぼうぎょ", "とくこう", "とくぼう", "すばやさ" ]
                        [ .hp, .attack, .defence, .spAttack, .spDefence, .speed ]
                ]
            ]
        ]


viewEvoHeaderImage : Dict String AppConfig.PokemonData -> String -> String -> Html msg
viewEvoHeaderImage pokemonDataDict no pokemonId =
    case Dict.get pokemonId pokemonDataDict of
        Just pokemonStatus ->
            let
                formString =
                    case pokemonStatus.maybeForm of
                        Just form ->
                            "&form=" ++ form

                        _ ->
                            ""
            in
            td
                [ classList
                    [ ( "main__td", True )
                    , ( "main__td-selected main__td-selected-top", no == pokemonId )
                    ]
                ]
                [ a
                    [ href <|
                        "pokemon.html?no="
                            ++ String.fromInt pokemonStatus.no
                            ++ formString
                    ]
                    [ img
                        [ src
                            ("/image/pokemon/"
                                ++ AppConfig.pokemonDataToId pokemonStatus
                                ++ ".png"
                            )
                        , class "pokemon__image-evo"
                        ]
                        []
                    ]
                ]

        _ ->
            td [ class "main__td" ] []


viewEvoHeaderName : Dict String AppConfig.PokemonData -> String -> String -> Html msg
viewEvoHeaderName pokemonDataDict no pokemonId =
    case Dict.get pokemonId pokemonDataDict of
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


viewEvoStatusLine : Dict String AppConfig.PokemonData -> List String -> String -> String -> (AppConfig.Status -> Int) -> Html msg
viewEvoStatusLine pokemonDataDict evolution no title f =
    tr [] <|
        th [ class "main__th main__th-center main__th-nowrap" ] [ text title ]
            :: List.map (viewEvoStatus pokemonDataDict no f (title == "すばやさ")) evolution


viewEvoStatus : Dict String AppConfig.PokemonData -> String -> (AppConfig.Status -> Int) -> Bool -> String -> Html msg
viewEvoStatus pokemonDataDict no f isLast pokemonId =
    case Dict.get pokemonId pokemonDataDict of
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
                    [ f pokemonStatus.status |> String.fromInt |> text ]
                ]

        _ ->
            td [ class "main__td" ] [ text "" ]
