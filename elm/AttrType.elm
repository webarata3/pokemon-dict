module AttrType exposing (..)

import AppConfig as AC
import Dict exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)



-- MODEL


type Scale
    = FourTimes
    | TwoTimes
    | Same
    | Half
    | Quarter
    | Zero


type alias Model =
    { maybeAttrTypes : Maybe (List AC.AttrType)
    , typeChart : Dict Int (List Scale)
    }



-- FUNCTION


getTypeChart : Dict Int (List Scale)
getTypeChart =
    let
        typeCharts =
            [ [ Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , TwoTimes
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Zero
              , Same
              , Same
              , Same
              , Same
              ]
            , [ Same
              , Half
              , TwoTimes
              , Half
              , Same
              , Half
              , Same
              , Same
              , TwoTimes
              , Same
              , Same
              , Half
              , TwoTimes
              , Same
              , Same
              , Same
              , Half
              , Half
              ]
            , [ Same
              , Half
              , Half
              , TwoTimes
              , TwoTimes
              , Half
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Half
              , Same
              ]
            , [ Same
              , TwoTimes
              , Half
              , Half
              , Half
              , TwoTimes
              , Same
              , TwoTimes
              , Half
              , TwoTimes
              , Same
              , TwoTimes
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              ]
            , [ Same
              , Same
              , Same
              , Same
              , Half
              , Same
              , Same
              , Same
              , TwoTimes
              , Half
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Half
              , Same
              ]
            , [ Same
              , TwoTimes
              , Same
              , Same
              , Same
              , Half
              , TwoTimes
              , Same
              , Same
              , Same
              , Same
              , Same
              , TwoTimes
              , Same
              , Same
              , Same
              , TwoTimes
              , Same
              ]
            , [ Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , TwoTimes
              , TwoTimes
              , Half
              , Half
              , Same
              , Same
              , Half
              , Same
              , TwoTimes
              ]
            , [ Same
              , Same
              , Same
              , Half
              , Same
              , Same
              , Half
              , Half
              , TwoTimes
              , Same
              , TwoTimes
              , Half
              , Same
              , Same
              , Same
              , Same
              , Same
              , Half
              ]
            , [ Same
              , Same
              , TwoTimes
              , TwoTimes
              , Zero
              , TwoTimes
              , Same
              , Half
              , Same
              , Same
              , Same
              , Same
              , Half
              , Same
              , Same
              , Same
              , Same
              , Same
              ]
            , [ Same
              , Same
              , Same
              , Half
              , TwoTimes
              , TwoTimes
              , Half
              , Same
              , Zero
              , Same
              , Same
              , Half
              , TwoTimes
              , Same
              , Same
              , Same
              , Same
              , Same
              ]
            , [ Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Half
              , Same
              , Same
              , Same
              , Half
              , TwoTimes
              , Same
              , TwoTimes
              , Same
              , TwoTimes
              , Same
              , Same
              ]
            , [ Same
              , TwoTimes
              , Same
              , Half
              , Same
              , Same
              , Half
              , Same
              , Half
              , TwoTimes
              , Same
              , Same
              , TwoTimes
              , Same
              , Same
              , Same
              , Same
              , Same
              ]
            , [ Half
              , Half
              , TwoTimes
              , TwoTimes
              , Same
              , Same
              , TwoTimes
              , Half
              , TwoTimes
              , Half
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , TwoTimes
              , Same
              ]
            , [ Zero
              , Same
              , Same
              , Same
              , Same
              , Same
              , Zero
              , Half
              , Same
              , Same
              , Same
              , Half
              , Same
              , TwoTimes
              , Same
              , TwoTimes
              , Same
              , Same
              ]
            , [ Same
              , Half
              , Half
              , Half
              , Half
              , TwoTimes
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , TwoTimes
              , Same
              , Same
              , TwoTimes
              ]
            , [ Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , TwoTimes
              , Same
              , Same
              , Same
              , Zero
              , TwoTimes
              , Same
              , Half
              , Same
              , Half
              , Same
              , TwoTimes
              ]
            , [ Half
              , TwoTimes
              , Same
              , Half
              , Same
              , Half
              , TwoTimes
              , Zero
              , TwoTimes
              , Half
              , Half
              , Half
              , Half
              , Same
              , Half
              , Same
              , Half
              , Half
              ]
            , [ Same
              , Same
              , Same
              , Same
              , Same
              , Same
              , Half
              , TwoTimes
              , Same
              , Same
              , Same
              , Half
              , Same
              , Same
              , Zero
              , Half
              , TwoTimes
              , Same
              ]
            ]
    in
    listToDictList typeCharts


listToDictList : List a -> Dict Int a
listToDictList list =
    List.indexedMap Tuple.pair list
        |> List.map (\e -> Tuple.mapFirst (\t -> t + 1) e)
        |> Dict.fromList


calcTypeChart : List AC.AttrType -> Dict Int (List Scale) -> List Scale
calcTypeChart attrTypes typeChart =
    let
        list =
            List.map (getScales typeChart) attrTypes

        first =
            List.head list |> Maybe.withDefault []
    in
    if List.length list == 1 then
        first

    else
        let
            second =
                List.drop 1 list
                    |> List.head
                    |> Maybe.withDefault []
        in
        List.map2 calcScale first second


getScales : Dict Int (List Scale) -> AC.AttrType -> List Scale
getScales typeChart attrType =
    Dict.get attrType.typeId typeChart
        |> Maybe.withDefault []


calcScale : Scale -> Scale -> Scale
calcScale scale1 scale2 =
    case scale1 of
        Zero ->
            Zero

        TwoTimes ->
            case scale2 of
                Zero ->
                    Zero

                TwoTimes ->
                    FourTimes

                Half ->
                    Same

                _ ->
                    TwoTimes

        Half ->
            case scale2 of
                Zero ->
                    Zero

                TwoTimes ->
                    Same

                Half ->
                    Quarter

                _ ->
                    Half

        _ ->
            scale2



-- VIEW


viewTypes : Model -> Html msg
viewTypes model =
    case model.maybeAttrTypes of
        Just attrTypes ->
            let
                scales =
                    calcTypeChart attrTypes model.typeChart
            in
            section [ class "pokemon__types" ]
                [ h2 [ class "main__sub-title" ] [ text "タイプと弱点" ]
                , div [ class "main__types" ] <|
                    List.map viewType attrTypes
                , viewTypeCharts scales
                    (List.range 1 18)
                    [ "ノーマル"
                    , "ほのお"
                    , "こおり"
                    , "くさ"
                    , "でんき"
                    , "こおり"
                    , "かくとう"
                    , "どく"
                    , "じめん"
                    , "ひこう"
                    , "エスパー"
                    , "むし"
                    , "いわ"
                    , "ゴースト"
                    , "ドラゴン"
                    , "あく"
                    , "はがね"
                    , "フェアリー"
                    ]
                ]

        _ ->
            div [] []


viewType : AC.AttrType -> Html msg
viewType attrType =
    div [ class "main__type main__continue-content" ]
        [ img
            [ src <|
                AC.getBaseUrl <|
                    "/image/type/"
                        ++ String.fromInt attrType.typeId
                        ++ ".svg"
            , class "type__image"
            ]
            []
        , br [] []
        , span [ class "type__name" ] [ text attrType.typeName ]
        ]


viewTypeCharts : List Scale -> List Int -> List String -> Html msg
viewTypeCharts scales typeIds typeNames =
    div [ class "type__scale" ] <|
        List.map3 viewTypeChart scales typeIds typeNames


viewTypeChart : Scale -> Int -> String -> Html msg
viewTypeChart scale typeId typeName =
    div []
        [ case scale of
            FourTimes ->
                div [ class "type__times type__week" ] [ text "4" ]

            TwoTimes ->
                div [ class "type__times type__week" ] [ text "2" ]

            _ ->
                div [ class "type__times" ] []
        , img
            [ src <|
                AC.getBaseUrl <|
                    "/image/type/"
                        ++ String.fromInt typeId
                        ++ ".svg"
            , class "type__image-small"
            , title typeName
            ]
            []
        , case scale of
            Zero ->
                div [ class "type__times type__strong" ] [ text "0" ]

            Quarter ->
                div [ class "type__times type__strong" ] [ text "¼" ]

            Half ->
                div [ class "type__times type__strong" ] [ text "½" ]

            _ ->
                div [ class "type__times" ] []
        ]
