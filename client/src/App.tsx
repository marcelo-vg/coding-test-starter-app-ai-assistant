import { ChatWidget } from './chat/ChatWidget.tsx';
import { GigListing } from './gigs/GigListing.tsx';

export function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Find gigs</h1>
        <p className="app__subtitle">Shifts and short-term work near you.</p>
      </header>

      <main>
        <GigListing />
      </main>

      <ChatWidget />
    </div>
  );
}
