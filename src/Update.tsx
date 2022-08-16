import * as R from 'ramda';
import {
  AuthState,
  State,
  ArticleCardsState,
  ArticleState,
  Sentence,
  SearchState,
  INITIAL_SEARCH_STATE,
  LayoutState,
  UnansweredQuiz,
  AnsweredQuiz,
  INITIAL_STATE,
  QuizState,
  ScoreState,
  QuizListState,
  RandomWorkoutState,
} from './Model';

export const ActionTypes = {
  signOut: 'signOut',
  setQuiz: 'setQuiz',
  setScore: 'setScore',
  setState: 'setState',
  changeUid: 'changeUid',
  setLayout: 'setLayout',
  setTopPage: 'setTopPage',
  setArticle: 'setArticle',
  setWorkout: 'setWorkout',
  submitQuiz: 'submitQuiz',
  inputSearch: 'inputSearch',
  clearSearch: 'clearSearch',
  authenticate: 'authenticate',
  startFetching: 'startFetching',
  setArticleList: 'setArticleList',
  setMoreArticles: 'setMoreArticles',
  setAudioContext: 'setAudioContext',
  inputSpecialMora: 'inputSpecialMora',
  inputPitchesArray: 'inputPitchesArray',
  setAssignmentBlob: 'setAssignmentBlob',
  setAnsweredQuizList: 'setAnsweredQuizList',
  removeAssignmentBlob: 'removeAssignmentBlob',
  removeUnAnsweredQuiz: 'removeUnAnsweredQuiz',
};

export type Action = {
  type: string;
  payload?:
    | State
    | string
    | QuizState
    | AuthState
    | SearchState
    | LayoutState
    | ArticleState
    | AudioContext
    | AnsweredQuiz[]
    | ArticleCardsState
    | UnansweredQuiz[]
    | RandomWorkoutState
    | { quiz: QuizState; score: ScoreState }
    | {
        score: ScoreState;
        quizzes: QuizListState;
      }
    | { articles: ArticleCardsState; quizzes: UnansweredQuiz[] }
    | {
        blob: Blob | null;
        sentence: Sentence;
      }
    | {
        questionIndex: number;
        pitchesArray: string[][][];
      }
    | {
        questionIndex: number;
        inputSpecialMoraArray: string[][];
        monitorSpecialMoraArray: string[][];
      }
    | null;
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  const { articlePage, auth, audioContext, layout, quiz, workout } = state;
  const { sentences } = articlePage;
  const { questions } = quiz;

  switch (type) {
    case ActionTypes.setState: {
      const newState = payload as State;
      return newState;
    }
    case ActionTypes.setWorkout: {
      const workout = payload as RandomWorkoutState;
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<RandomWorkoutState, State>(['workout'], workout)
      )(state);
    }
    case ActionTypes.signOut: {
      return INITIAL_STATE;
    }
    case ActionTypes.changeUid: {
      const uid = payload as string;
      return {
        ...INITIAL_STATE,
        auth: { ...auth, uid },
        audioContext,
        layout,
      };
    }
    case ActionTypes.authenticate: {
      const auth = payload as AuthState;
      return { ...state, auth };
    }
    case ActionTypes.setTopPage: {
      const { articles, quizzes } = payload as {
        articles: ArticleCardsState;
        quizzes: UnansweredQuiz[];
      };
      return R.compose(
        R.assocPath<ArticleCardsState, State>(['topPage'], articles),
        R.assocPath<UnansweredQuiz[], State>(
          ['quizzes', 'unansweredList'],
          quizzes
        )
      )(state);
    }
    case ActionTypes.setArticleList: {
      const articlesPage = payload as ArticleCardsState;
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<ArticleCardsState, State>(['articlesPage'], articlesPage)
      )(state);
    }
    // debug 上とまとめる？
    case ActionTypes.setMoreArticles: {
      const articlesPage = payload as ArticleCardsState;
      return { ...state, articlesPage };
    }
    case ActionTypes.startFetching: {
      return { ...state, isFetching: true };
    }
    case ActionTypes.setArticle: {
      const articlePage = payload as ArticleState;
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<ArticleState, State>(['articlePage'], articlePage),
        R.assocPath<ArticleState, State>(
          ['memo', 'articlePages', articlePage.article.id],
          articlePage
        )
      )(state);
    }
    case ActionTypes.setAudioContext: {
      const audioContext = payload as AudioContext | null;
      return { ...state, audioContext };
    }
    case ActionTypes.setAssignmentBlob: {
      const { sentence, blob } = payload as {
        blob: Blob | null;
        sentence: Sentence;
      };
      const { id } = sentence;
      const updatedSentences = sentences.map((s) =>
        s.id !== id ? s : sentence
      );

      return R.compose(
        R.assocPath<Blob | null, State>(
          ['articlePage', 'assignmentBlobs', id],
          blob
        ),
        R.assocPath<Sentence[], State>(
          ['articlePage', 'sentences'],
          updatedSentences
        )
      )(state);
    }
    case ActionTypes.removeAssignmentBlob: {
      const sentenceId = payload as string;

      const updatedSentences = sentences.map((s) =>
        s.id !== sentenceId ? s : { ...s, storageDuration: 0, storagePath: '' }
      );

      return R.compose(
        R.dissocPath<State>(['articlePage', 'assignmentBlobs', sentenceId]),
        R.assocPath<Sentence[], State>(
          ['articlePage', 'sentences'],
          updatedSentences
        )
      )(state);
    }
    case ActionTypes.inputSearch: {
      const search = payload as SearchState;
      const { keywords, hitItems } = search;
      return R.compose(
        R.assocPath<SearchState, State>(['search'], search),
        R.assocPath<Sentence[], State>(
          ['memo', 'hitItems', keywords.join(',')],
          hitItems
        )
      )(state);
    }
    case ActionTypes.clearSearch: {
      return R.compose(
        R.assocPath<SearchState, State>(['search'], INITIAL_SEARCH_STATE)
      )(state);
    }
    case ActionTypes.setLayout: {
      const layout = payload as LayoutState;
      return R.compose(R.assocPath<LayoutState, State>(['layout'], layout))(
        state
      );
    }
    case ActionTypes.setAnsweredQuizList: {
      const answeredQuizList = payload as AnsweredQuiz[];
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<AnsweredQuiz[], State>(
          ['quizzes', 'answeredList'],
          answeredQuizList
        )
      )(state);
    }
    case ActionTypes.setQuiz: {
      const quiz = payload as QuizState;
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<QuizState, State>(['quiz'], quiz),
        R.assocPath<QuizState, State>(['memo', 'quizzes', quiz.id], quiz)
      )(state);
    }
    case ActionTypes.setScore: {
      const { quiz, score } = payload as { quiz: QuizState; score: ScoreState };
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<QuizState, State>(['quiz'], quiz),
        R.assocPath<QuizState, State>(['memo', 'quizzes', quiz.id], quiz),
        R.assocPath<ScoreState, State>(['score'], score),
        R.assocPath<ScoreState, State>(['memo', 'scores', score.id], score)
      )(state);
    }
    case ActionTypes.inputPitchesArray: {
      const { questionIndex, pitchesArray } = payload as {
        questionIndex: number;
        pitchesArray: string[][][];
      };
      return R.compose(
        R.assocPath<string[][][], State>(
          ['quiz', 'questions', questionIndex, 'inputPitchesArray'],
          pitchesArray
        )
      )(state);
    }
    case ActionTypes.submitQuiz: {
      const { score, quizzes } = payload as {
        score: ScoreState;
        quizzes: QuizListState;
      };
      const initialQuestions = questions.map((question) => {
        const { initialPitchesArray, initialSpecialMoraArray } = question;
        return {
          ...question,
          inputPitchesArray: initialPitchesArray,
          inputSpecialMoraArray: initialSpecialMoraArray,
        };
      });
      const initialQuiz: QuizState = { ...quiz, questions: initialQuestions };
      return R.compose(
        R.assocPath<boolean, State>(['isFetching'], true),
        R.assocPath<QuizState, State>(['memo', 'quizzes'], initialQuiz),
        R.assocPath<ScoreState, State>(['score'], score),
        R.assocPath<ScoreState, State>(['memo', 'scores', score.id], score),
        R.assocPath<QuizListState, State>(['quizzes'], quizzes)
      )(state);
    }
    case ActionTypes.inputSpecialMora: {
      const { questionIndex, inputSpecialMoraArray, monitorSpecialMoraArray } =
        payload as {
          questionIndex: number;
          inputSpecialMoraArray: string[][];
          monitorSpecialMoraArray: string[][];
        };
      return R.compose(
        R.assocPath<string[][], State>(
          ['quiz', 'questions', questionIndex, 'inputSpecialMoraArray'],
          inputSpecialMoraArray
        ),
        R.assocPath<string[][], State>(
          ['quiz', 'questions', questionIndex, 'monitorSpecialMoraArray'],
          monitorSpecialMoraArray
        )
      )(state);
    }
    case ActionTypes.removeUnAnsweredQuiz: {
      const unansweredList = payload as UnansweredQuiz[];

      return R.compose(
        R.assocPath<UnansweredQuiz[], State>(
          ['quizzes', 'unansweredList'],
          unansweredList
        )
      )(state);
    }
    default:
      return state;
  }
};
