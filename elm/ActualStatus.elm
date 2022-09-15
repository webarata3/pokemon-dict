module ActualStatus exposing (..)

import AppConfig as AC
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)



-- MODEL


type Nature
    = Good
    | Normal
    | Bad


type alias Correction =
    { individualValue : Int
    , effortValue : Int
    , nature : Nature
    }


type alias Model =
    { maybeStatus : Maybe AC.Status
    , inputLevel : Int
    , inputIndividualValue : Int
    , inputEffortValue : Int
    , inputNature : Nature
    }


type Msg
    = InputLevel String
    | ClickIndividualValue Int
    | ClickEffortValue Int
    | ClickNature Nature



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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

        ClickIndividualValue individualValue ->
            ( { model | inputIndividualValue = individualValue }, Cmd.none )

        ClickEffortValue effortValue ->
            ( { model | inputEffortValue = effortValue }, Cmd.none )

        ClickNature nature ->
            ( { model | inputNature = nature }, Cmd.none )



-- FUNCTION


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


viewActualStatus : Model -> Html Msg
viewActualStatus model =
    case model.maybeStatus of
        Just status ->
            viewIndividualValue model status

        _ ->
            section [ class "pokemon__value" ] []


viewIndividualValue : Model -> AC.Status -> Html Msg
viewIndividualValue model status =
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
            , button
                [ class "main__link-button"
                , onClick <| InputLevel "1"
                ]
                [ text "1" ]
            , button
                [ class "main__link-button"
                , onClick <| InputLevel "50"
                ]
                [ text "50" ]
            , button
                [ class "main__link-button"
                , onClick <| InputLevel "100"
                ]
                [ text "100" ]
            , viewIndividual model status
            ]
        ]


viewIndividual : Model -> AC.Status -> Html Msg
viewIndividual model status =
    table []
        [ viewIndividualHead model
        , tbody [] <|
            List.map2
                (viewCalcStatusRow
                    status
                    [ { individualValue = 31
                      , effortValue = 252
                      , nature = Good
                      }
                    , { individualValue = 31
                      , effortValue = 0
                      , nature = Good
                      }
                    , { individualValue = 31
                      , effortValue = 0
                      , nature = Normal
                      }
                    , { individualValue = model.inputIndividualValue
                      , effortValue = model.inputEffortValue
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
                    , checked <| model.inputIndividualValue == 31
                    , onClick <| ClickIndividualValue 31
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
                    , checked <| model.inputIndividualValue == 0
                    , onClick <| ClickIndividualValue 0
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
                    , checked <| model.inputEffortValue == 252
                    , onClick <| ClickEffortValue 252
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
                    , checked <| model.inputEffortValue == 0
                    , onClick <| ClickEffortValue 0
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


viewCalcStatusRow : AC.Status -> List Correction -> Int -> String -> (AC.Status -> Int) -> Html Msg
viewCalcStatusRow status corrections inputLevel title f =
    tr [] <|
        th [ class "main__th main__th-center" ] [ text title ]
            :: List.map (viewCalcStatus status inputLevel (title == "HP") f) corrections


viewCalcStatus : AC.Status -> Int -> Bool -> (AC.Status -> Int) -> Correction -> Html Msg
viewCalcStatus status inputLevel isHp f correction =
    let
        value =
            if isHp then
                String.fromInt
                    (calcHp (f status)
                        correction.individualValue
                        correction.effortValue
                        inputLevel
                    )

            else
                String.fromInt
                    (calcParam (f status)
                        correction.individualValue
                        correction.effortValue
                        inputLevel
                        correction.nature
                    )
    in
    td [ class "main__td number" ] [ text value ]
