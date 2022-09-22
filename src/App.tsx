import Button from './components/Button';
import Checkbox from './components/Checkbox';
import Window from './components/Window';

function App() {
  return (
    <Window title="Test window">
      <Button>test</Button>
      <Checkbox label="Check box" />
    </Window>
  );
}

export default App;
