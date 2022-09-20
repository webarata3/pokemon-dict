module AttrType exposing (..)

import AppConfig as AC
import Dict exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)



-- MODEL


type alias AttrType =
    { typeId : Int
    , typeName : String
    }


type Scale
    = FourTimes
    | TwoTimes
    | Same
    | Half
    | Quarter
    | Zero


type alias Model =
    { attrTypes : List AttrType
    , typeChart : Dict Int (Dict Int Scale)
    }



-- FUNCTION


getTypeChart : Dict Int (Dict Int Scale)
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
    List.map
        (\e ->
            listToDictList e
        )
        typeCharts
        |> listToDictList


listToDictList : List a -> Dict Int a
listToDictList list =
    List.indexedMap Tuple.pair list
        |> List.map (\e -> Tuple.mapFirst (\t -> t + 1) e)
        |> Dict.fromList
