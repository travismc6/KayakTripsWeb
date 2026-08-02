export type TripSummary = {
  id: string;
  riverName: string;
  state: string | null;
  startDate: string | null;
  endDate: string | null;
  sourceDateText: string | null;
  datePrecision: string | null;
  distanceMiles: number | null;
  timeMinutes: number | null;
  startPoint: string | null;
  startLatitude: number | null;
  startLongitude: number | null;
  endPoint: string | null;
  endLatitude: number | null;
  endLongitude: number | null;
  notes: string | null;
};

export type TripLeg = {
  id: string; sequence: number; startDate: string | null; endDate: string | null;
  startPoint: string | null; startLatitude: number | null; startLongitude: number | null;
  endPoint: string | null; endLatitude: number | null; endLongitude: number | null;
  stageFeet: number | null; flowCfs: number | null; timeMinutes: number | null;
  distanceMiles: number | null; measuredAt: string | null; notes: string | null;
};

export type TripDetail = Omit<TripSummary, "state"> & {
  name: string | null; states: string[]; startLatitude: number | null; startLongitude: number | null;
  endLatitude: number | null; endLongitude: number | null; legs: TripLeg[];
};

export type Photo = { id: string; tripId: string; url: string; caption: string | null; takenAt: string | null };

export type ImportRow = { sourceRow: number; canImport: boolean; riverName: string | null; state: string | null; startDate: string | null; sourceDateText: string | null; distanceMiles: number | null; warnings: string[] };
export type ImportPreview = { sheet: string | null; rowsRead: number; importableRows: number; skippedRows: number; rows: ImportRow[] };
