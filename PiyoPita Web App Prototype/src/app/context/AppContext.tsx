import React, { createContext, useContext, useState, ReactNode } from 'react';

export type EvaluationType = 'good' | 'normal' | 'bad' | 'peeled';

export interface Record {
  id: string;
  date: Date;
  evaluation: EvaluationType;
  imageUrl?: string;
  time: string;
  isTimeModified: boolean;
}

export interface PatientInfo {
  name: string;
  nickname: string;
  birthDate: Date;
  clinicName: string;
  doctorName: string;
}

interface AppContextType {
  patientInfo: PatientInfo | null;
  setPatientInfo: (info: PatientInfo) => void;
  records: Record[];
  addRecord: (record: Record) => void;
  updateRecord: (id: string, record: Partial<Record>) => void;
  getRecordByDate: (date: Date) => Record | undefined;
  isRegistered: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [records, setRecords] = useState<Record[]>([
    // モックデータ
    {
      id: '1',
      date: new Date(2026, 1, 10),
      evaluation: 'good',
      time: '07:15',
      isTimeModified: false,
    },
    {
      id: '2',
      date: new Date(2026, 1, 11),
      evaluation: 'good',
      time: '07:20',
      isTimeModified: false,
    },
    {
      id: '3',
      date: new Date(2026, 1, 12),
      evaluation: 'normal',
      time: '08:30',
      isTimeModified: true,
    },
    {
      id: '4',
      date: new Date(2026, 1, 13),
      evaluation: 'peeled',
      time: '07:00',
      isTimeModified: false,
    },
  ]);

  const addRecord = (record: Record) => {
    setRecords((prev) => [...prev, record]);
  };

  const updateRecord = (id: string, updatedRecord: Partial<Record>) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...updatedRecord } : record
      )
    );
  };

  const getRecordByDate = (date: Date) => {
    return records.find(
      (record) =>
        record.date.getFullYear() === date.getFullYear() &&
        record.date.getMonth() === date.getMonth() &&
        record.date.getDate() === date.getDate()
    );
  };

  const isRegistered = patientInfo !== null;

  return (
    <AppContext.Provider
      value={{
        patientInfo,
        setPatientInfo,
        records,
        addRecord,
        updateRecord,
        getRecordByDate,
        isRegistered,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
