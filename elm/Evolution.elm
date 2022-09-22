module Evolution exposing (..)

import AppConfig
import Dict exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


type alias Model =
    { maybePokemonData : Maybe AppConfig.PokemonData
    , pokemonDataDict : Dict String AppConfig.PokemonData
    , animTiming : Bool
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
                    List.map3
                        (viewEvoStatusLine model.pokemonDataDict
                            pokemonData.evolution
                            id
                            model.animTiming
                        )
                        [ "HP", "こうげき", "ぼうぎょ", "とくこう", "とくぼう", "すばやさ" ]
                        [ .hp, .attack, .defence, .spAttack, .spDefence, .speed ]
                        [ "1", "2", "3", "4", "5", "6" ]
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
                                ++ ".webp"
                            )
                        , width 100
                        , height 100
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
            <|
                div []
                    [ text pokemonStatus.name
                    ]
                    :: (case pokemonStatus.maybeFormName of
                            Just formName ->
                                [ div [ class "main__form-name" ]
                                    [ text formName
                                    ]
                                ]

                            _ ->
                                []
                       )

        _ ->
            th [ class "main__th" ] [ text "読込中" ]


viewEvoStatusLine : Dict String AppConfig.PokemonData -> List String -> String -> Bool -> String -> (AppConfig.Status -> Int) -> String -> Html msg
viewEvoStatusLine pokemonDataDict evolution no animTiming title f styleNo =
    tr [] <|
        th [ class "main__th main__th-center main__th-nowrap" ] [ text title ]
            :: List.map
                (viewEvoStatus pokemonDataDict
                    no
                    f
                    (title == "すばやさ")
                    animTiming
                    styleNo
                )
                evolution


viewEvoStatus : Dict String AppConfig.PokemonData -> String -> (AppConfig.Status -> Int) -> Bool -> Bool -> String -> String -> Html msg
viewEvoStatus pokemonDataDict no f isLast animTiming styleNo pokemonId =
    case Dict.get pokemonId pokemonDataDict of
        Just pokemonStatus ->
            let
                tempWidth =
                    f pokemonStatus.status * 2 // 3

                barWidth =
                    if tempWidth > 100 then
                        100

                    else
                        tempWidth
            in
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
                , div
                    [ style "width"
                        (String.fromInt barWidth ++ "px")
                    , classList
                        [ ( "main__td-status-bar", True )
                        , ( "main__td-status-bar-anim" ++ styleNo, animTiming )
                        ]
                    ]
                    []
                ]

        _ ->
            td [ class "main__td" ] [ text "" ]
