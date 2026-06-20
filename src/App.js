import React, { useState } from "react";
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
import StudyTimer from "./pages/StudyTimer";
import QuoteBank from "./pages/QuoteBank";
import AnswerFrameworks from "./pages/AnswerFrameworks";
import RevisionCards from "./pages/RevisionCards";
import { SAMPLE_NOTES, SAMPLE_NOTE_CONTENT } from "./lib/constants";
import "./App.css";

const FULL_SCREEN_PAGES = new Set(["viewer", "editor"]);

export default function App() {
  const [activePage,   setActivePage]   = useState("dashboard");
  const [activeNote,   setActiveNote]   = useState(null);
  const [notes,        setNotes]        = useState(SAMPLE_NOTES);
  const [noteContents, setNoteContents] = useState(SAMPLE_NOTE_CONTENT);

  const navigate = (page, opts) => {
    setActivePage(page);
    if (opts?.noteId) setActiveNote(opts.noteId);
  };

  const createNote = (meta, content) => {
    setNotes(prev => [meta, ...prev]);
    setNoteContents(prev => ({ ...prev, [meta.id]: content }));
    navigate("viewer", { noteId: meta.id });
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
        return <PDFLibrary />;
      case "generator":
        return <NoteGenerator onNavigate={navigate} onCreateNote={createNote} />;
      case "notes":
        return <MyNotes onNavigate={navigate} notes={notes} />;
      case "viewer":
        return (
          <NoteViewer
            noteId={activeNote || "1"}
            noteContents={noteContents}
            onBack={() => setActivePage("notes")}
            onNavigate={navigate}
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
        return <PYQMapper onNavigate={navigate} />;
      case "answers":
        return <AnswerBuilder onNavigate={navigate} />;
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
