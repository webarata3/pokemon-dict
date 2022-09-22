module Ability exposing (..)

import AppConfig as AC
import Dict exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)



-- MODEL


type alias Model =
    { maybeAbilities : Maybe (List AC.Ability)
    }



-- VIEW


viewAbilitiesSection : Model -> Html msg
viewAbilitiesSection model =
    case model.maybeAbilities of
        Just abilities ->
            section [ class "abilities" ]
                [ h2 [ class "main__sub-title" ] [ text "とくせい" ]
                , viewAbilities abilities
                ]

        _ ->
            div [] []


viewAbilities : List AC.Ability -> Html msg
viewAbilities abilities =
    table [ class "main__table" ]
        [ tbody [] <|
            List.map viewAbility abilities
        ]


viewAbility : AC.Ability -> Html msg
viewAbility ability =
    tr []
        [ th [ class "main__th main__th-nowrap" ] <|
            if ability.hidden then
                [ span [ class "hidden-ability" ] [ text "隠" ]
                , span [] [ text ability.abilityName ]
                ]

            else
                [ span [] [ text ability.abilityName ] ]
        , td [ class "main__td" ] [ text ability.abilityEffect ]
        ]
