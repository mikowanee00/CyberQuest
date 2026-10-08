/* =====================================================================
 * components/activities/index.js — Maps the activity "type" used in
 * data/lessons.js to the React component that draws it.
 * ===================================================================== */
import { FlipCards, ChoiceExplorer, Triage } from './SimpleActivities.jsx';
import HotspotHunt from './HotspotHunt.jsx';
import PasswordLab from './PasswordLab.jsx';
import ChatScenario from './ChatScenario.jsx';
import Sorter from './Sorter.jsx';

export const ACTIVITIES = {
  flipCards: FlipCards,
  hotspots: HotspotHunt,
  passwordLab: PasswordLab,
  chat: ChatScenario,
  explorer: ChoiceExplorer,
  sorter: Sorter,
  triage: Triage
};