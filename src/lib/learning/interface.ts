export interface Case {
  numordrep?: number;
  tpsglobal?: number;
  txt?: string;
  itxt?: string;
  etati?: "Cre" | "Choi" | "Lo" | "Win";
  isbou?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  id?: number;
  isLocked?: boolean;
  size?: string;
  place?: boolean;
  index?: number;
  mode?: boolean;
  force?: boolean;
}

export interface MenuItem {
  title: string;
  icon: React.ReactNode;
  tpsglobal?: number;
  color: string;
}

export interface ViewState {
  isEnded: boolean;
  isActive: boolean;
  isNotStarted: boolean;
}

export interface ValidationMessage {
  text: string;
  type: 'success' | 'error';
}