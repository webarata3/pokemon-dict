module AttrType exposing (..)

import AppConfig as AC
import Dict exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as JD exposing (Decoder, field, int, string)



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
              , Same
              , Half
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
              , Same
              , Same
              , Half
              , Same
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
              , Same
              , Half
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
              , Zero
              , TwoTimes
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
              , TwoTimes
              , Half
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
              , Same
              , Half
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
              , Same
              , TwoTimes
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
              , Same
              , Half
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



-- VIEW


viewTypes : Model -> Html msg
viewTypes model =
    section [ class "pokemon__types" ]
        [ h2 [ class "main__sub-title" ] [ text "タイプと弱点" ]
        , case model.maybeAttrTypes of
            Just attrTypes ->
                div [] <|
                    List.map viewType attrTypes

            _ ->
                div [] []
        ]


viewType : AC.AttrType -> Html msg
viewType attrType =
    div [] [ text attrType.typeName ]
