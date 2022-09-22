module AppConfig exposing (..)

-- MODEL


type alias AttrType =
    { typeId : Int
    , typeName : String
    }


type alias Ability =
    { abilityName: String
    , abilityEffect: String
    , hidden : Bool
    }


type alias Status =
    { hp : Int
    , attack : Int
    , defence : Int
    , spAttack : Int
    , spDefence : Int
    , speed : Int
    }


type alias PokemonData =
    { no : Int
    , maybeForm : Maybe String
    , name : String
    , maybeFormName : Maybe String
    , status : Status
    , types : List AttrType
    , abilities: List Ability
    , evolution : List String
    }


getBaseUrl : String -> String
getBaseUrl suffix =
    suffix


pokemonDataToId : PokemonData -> String
pokemonDataToId pokemonData =
    pokemonNoFormToId pokemonData.no pokemonData.maybeForm


pokemonNoFormToId : Int -> Maybe String -> String
pokemonNoFormToId no maybeForm =
    String.fromInt no
        ++ (Maybe.map (\v -> "-" ++ v) maybeForm
                |> Maybe.withDefault ""
           )
