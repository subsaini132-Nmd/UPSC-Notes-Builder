import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PDFLibrary from "./pages/PDFLibrary";
import NoteGenerator from "./pages/NoteGenerator";
import MyNotes from "./pages/MyNotes";
import NoteViewer from "./pages/NoteViewer";
import NoteEditor from "./pages/NoteEditor";
import PYQMapper from "./pages/PYQMapper";
import AnswerBuilder from "./pages/AnswerBuilder";
import Search from "./pages/Search";
import Flashcards from "./pages/Flashcards";
import RevisionPlanner from "./pages/RevisionPlanner";
import CurrentAffairs from "./pages/CurrentAffairs";
import QuizMode from "./pages/QuizMode";
import GSProgress from "./pages/GSProgress";
import EssayBuilder from "./pages/EssayBuilder";
import MainsPlanner from "./pages/MainsPlanner";
import OptionalTracker from "./pages/OptionalTracker";
import AnswerPractice from "./pages/AnswerPractice";
import MockTracker from "./pages/MockTracker";
import DataSheet from "./pages/DataSheet";
import SyllabusTracker from "./pages/SyllabusTracker";
import SyllabusManager from "./pages/SyllabusManager";
import ToppersCopies from "./pages/ToppersCopies";
import Chatbot from "./pages/Chatbot";
import StudyTimer from "./pages/StudyTimer";
import QuoteBank from "./pages/QuoteBank";
import AnswerFrameworks from "./pages/AnswerFrameworks";
import RevisionCards from "./pages/RevisionCards";
import AnswerEvaluator from "./pages/AnswerEvaluator";
import SmartPlanner from "./pages/SmartPlanner";
import StudyStreaks from "./pages/StudyStreaks";
import { SAMPLE_NOTES, SAMPLE_NOTE_CONTENT } from "./lib/constants";
import "./App.css";

const FULL_SCREEN_PAGES = new Set(["viewer", "editor", "toppers", "chatbot"]);

export default function App() {
  const [activePage,     setActivePage]     = useState("dashboard");
  const [activeNote,     setActiveNote]     = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [notes,          setNotes]          = useState(SAMPLE_NOTES);
  const [noteContents,   setNoteContents]   = useState(SAMPLE_NOTE_CONTENT);
  const [chatQuestion,   setChatQuestion]   = useState(null);
  const [chatPyqId,      setChatPyqId]      = useState(null);
  const [bankQuestions,  setBankQuestions]  = useState(() => {
    try {
      const saved = localStorage.getItem("upsc_bank_questions");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("upsc_bank_questions", JSON.stringify(bankQuestions)); } catch {}
  }, [bankQuestions]);

  const navigate = (page, opts) => {
    setActivePage(page);
    if (opts?.noteId    !== undefined) setActiveNote(opts.noteId);
    if (opts?.questionId    !== undefined) setActiveQuestion(opts.questionId);
    if (opts?.chatQuestion  !== undefined) setChatQuestion(opts.chatQuestion);
    if (opts?.chatPyqId    !== undefined) setChatPyqId(opts.chatPyqId);
  };

  const createNote = (meta, content) => {
    setNotes(prev => [meta, ...prev]);
    setNoteContents(prev => ({ ...prev, [meta.id]: content }));
    navigate("viewer", { noteId: meta.id });
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    setNoteContents(prev => { const next = { ...prev }; delete next[noteId]; return next; });
    if (activeNote === noteId) setActivePage("notes");
  };

  const updateNoteContent = (noteId, sectionId, text) => {
    setNoteContents(prev => ({
      ...prev,
      [noteId]: {
        ...prev[noteId],
        sections: { ...prev[noteId]?.sections, [sectionId]: text },
      },
    }));
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} notes={notes} />;
      case "library":
        return <PDFLibrary onNavigate={navigate} />;
      case "syllabusmap":
        return <SyllabusManager onNavigate={navigate} />;
      case "toppers":
        return <ToppersCopies onNavigate={navigate} />;
      case "chatbot":
        return (
          <Chatbot
            onNavigate={navigate}
            initialQuestion={chatQuestion}
            onQuestionUsed={() => { setChatQuestion(null); setChatPyqId(null); }}
            pyqId={chatPyqId}
          />
        );
      case "generator":
        return <NoteGenerator onNavigate={navigate} onCreateNote={createNote} />;
      case "notes":
        return <MyNotes onNavigate={navigate} notes={notes} onDeleteNote={deleteNote} />;
      case "viewer":
        return (
          <NoteViewer
            noteId={activeNote || "1"}
            noteContents={noteContents}
            onBack={() => setActivePage("notes")}
            onNavigate={navigate}
            onUpdateContent={updateNoteContent}
            onDeleteNote={deleteNote}
          />
        );
      case "editor":
        return (
          <NoteEditor
            noteId={activeNote || "1"}
            noteContents={noteContents}
            onUpdateContent={updateNoteContent}
            onBack={() => setActivePage("viewer")}
            onNavigate={navigate}
          />
        );
      case "pyq":
        return <PYQMapper onNavigate={navigate} bankQuestions={bankQuestions} setBankQuestions={setBankQuestions} />;
      case "answers":
        return <AnswerBuilder onNavigate={navigate} bankQuestions={bankQuestions} activeQuestion={activeQuestion} />;
      case "search":
        return <Search onNavigate={navigate} notes={notes} noteContents={noteContents} />;
      case "flashcards":
        return <Flashcards onNavigate={navigate} notes={notes} />;
      case "revision":
        return <RevisionPlanner onNavigate={navigate} />;
      case "affairs":
        return <CurrentAffairs onNavigate={navigate} />;
      case "quiz":
        return <QuizMode onNavigate={navigate} notes={notes} />;
      case "progress":
        return <GSProgress onNavigate={navigate} />;
      case "essay":
        return <EssayBuilder onNavigate={navigate} />;
      case "planner":
        return <MainsPlanner onNavigate={navigate} />;
      case "optional":
        return <OptionalTracker onNavigate={navigate} notes={notes} noteContents={noteContents} />;
      case "practice":
        return <AnswerPractice onNavigate={navigate} />;
      case "mocks":
        return <MockTracker onNavigate={navigate} />;
      case "data":
        return <DataSheet onNavigate={navigate} />;
      case "syllabus":
        return <SyllabusTracker onNavigate={navigate} notes={notes} noteContents={noteContents} />;
      case "timer":
        return <StudyTimer onNavigate={navigate} />;
      case "quotes":
        return <QuoteBank onNavigate={navigate} />;
      case "frameworks":
        return <AnswerFrameworks onNavigate={navigate} />;
      case "rcards":
        return <RevisionCards onNavigate={navigate} notes={notes} noteContents={noteContents} />;
      case "evaluator":
        return <AnswerEvaluator onNavigate={navigate} />;
      case "smartplan":
        return <SmartPlanner onNavigate={navigate} />;
      case "streaks":
        return <StudyStreaks onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} notes={notes} />;
    }
  };

  const isFullScreen = FULL_SCREEN_PAGES.has(activePage);

  return (
    <div className="app-shell">
      {!isFullScreen && (
        <Sidebar activePage={activePage} onNavigate={navigate} />
      )}
      <main className={`app-main ${isFullScreen ? "app-main-full" : ""}`}>
        {renderPage()}
      </main>
    </div>
  );
}
