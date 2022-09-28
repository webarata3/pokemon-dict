module Toc exposing (..)

import AppConfig as AC
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as JD exposing (Decoder, decodeString, field, string)



-- MODEL


type alias Link =
    { name : String
    , link : String
    , image : String
    }


decodeLink : Decoder Link
decodeLink =
    JD.map3 Link
        (field "name" string)
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
    , searchWord : String
    }


type Msg
    = GotPokemonList (Result Http.Error String)
    | InputSearch String



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

        InputSearch search ->
            ( { model
                | searchWord = search
              }
            , Cmd.none
            )



-- FUNCTIONS


getPokemonList : Cmd Msg
getPokemonList =
    Http.get
        { url = AC.getBaseUrl "/api/pokemon-list.json"
        , expect = Http.expectString GotPokemonList
        }


getKanaList : List ( String, String )
getKanaList =
    [ ( "あ", "ア" )
    , ( "い", "イ" )
    , ( "う", "ウ" )
    , ( "え", "エ" )
    , ( "お", "オ" )
    , ( "か", "カ" )
    , ( "き", "キ" )
    , ( "く", "ク" )
    , ( "け", "ケ" )
    , ( "こ", "コ" )
    , ( "さ", "サ" )
    , ( "し", "シ" )
    , ( "す", "ス" )
    , ( "せ", "セ" )
    , ( "そ", "ソ" )
    , ( "た", "タ" )
    , ( "ち", "チ" )
    , ( "つ", "ツ" )
    , ( "て", "テ" )
    , ( "と", "ト" )
    , ( "な", "ナ" )
    , ( "に", "ニ" )
    , ( "ぬ", "ヌ" )
    , ( "ね", "ネ" )
    , ( "の", "ノ" )
    , ( "は", "ハ" )
    , ( "ひ", "ヒ" )
    , ( "ふ", "フ" )
    , ( "へ", "ヘ" )
    , ( "ほ", "ホ" )
    , ( "ま", "マ" )
    , ( "み", "ミ" )
    , ( "む", "ム" )
    , ( "め", "メ" )
    , ( "も", "モ" )
    , ( "や", "ヤ" )
    , ( "ゆ", "ユ" )
    , ( "よ", "ヨ" )
    , ( "ら", "ラ" )
    , ( "り", "リ" )
    , ( "る", "ル" )
    , ( "れ", "レ" )
    , ( "ろ", "ロ" )
    , ( "わ", "ワ" )
    , ( "を", "ヲ" )
    , ( "ん", "ン" )
    , ( "が", "ガ" )
    , ( "ぎ", "ギ" )
    , ( "ぐ", "グ" )
    , ( "げ", "ゲ" )
    , ( "げ", "ゲ" )
    , ( "ざ", "ザ" )
    , ( "じ", "ジ" )
    , ( "ず", "ズ" )
    , ( "ぜ", "ゼ" )
    , ( "ぞ", "ゾ" )
    , ( "だ", "ダ" )
    , ( "ぢ", "ヂ" )
    , ( "づ", "ヅ" )
    , ( "で", "デ" )
    , ( "ど", "ド" )
    , ( "ば", "バ" )
    , ( "び", "ビ" )
    , ( "ぶ", "ブ" )
    , ( "べ", "ベ" )
    , ( "ぼ", "ボ" )
    , ( "ぱ", "パ" )
    , ( "ぴ", "ピ" )
    , ( "ぷ", "プ" )
    , ( "ぺ", "ペ" )
    , ( "ぽ", "ポ" )
    , ( "ぁ", "ァ" )
    , ( "ぃ", "ィ" )
    , ( "ぅ", "ゥ" )
    , ( "ぇ", "ェ" )
    , ( "ぉ", "ォ" )
    , ( "っ", "ッ" )
    , ( "ゃ", "ャ" )
    , ( "ゅ", "ュ" )
    , ( "ょ", "ョ" )
    ]



-- VIEW


viewPokemonList : Model -> Html Msg
viewPokemonList model =
    let
        searchWord =
            List.foldl
                (\e word ->
                    String.replace (Tuple.first e) (Tuple.second e) word
                )
                model.searchWord
                getKanaList

        links =
            List.filter (\e -> String.contains searchWord e.name) model.links
    in
    div [ class "pokemon__search" ]
        [ img [ src <| AC.getBaseUrl "/image/zukan.webp" ] []
        , viewSearch model.searchWord
        , div [ class "pokemon__list" ] <|
            List.map viewPokemonLink links
        ]


viewSearch : String -> Html Msg
viewSearch searchWord =
    input
        [ type_ "text"
        , placeholder "検索"
        , value searchWord
        , onInput InputSearch
        , class "search__input"
        ]
        []


viewPokemonLink : Link -> Html Msg
viewPokemonLink link =
    a [ href <| AC.getBaseUrl link.link ]
        [ img
            [ src <| AC.getBaseUrl link.image
            , attribute "loading" "lazy"
            , class "pokemon__link"
            , width 90
            , height 90
            ]
            []
        ]
