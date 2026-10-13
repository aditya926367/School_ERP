import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type TimetableEntry = {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  start: number;
  end: number;
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const timetable: Record<string, TimetableEntry[]> = {
  Monday: [
    { time: "08:30 - 09:15", subject: "Mathematics", teacher: "Rahul Verma", room: "Room 201", start: 510, end: 555 },
    { time: "09:15 - 10:00", subject: "English", teacher: "Priya Sharma", room: "Room 201", start: 555, end: 600 },
    { time: "10:00 - 10:15", subject: "Short Break", teacher: "—", room: "School Campus", start: 600, end: 615 },
    { time: "10:15 - 11:00", subject: "Science", teacher: "Anjali Singh", room: "Lab 1", start: 615, end: 660 },
    { time: "11:00 - 11:45", subject: "Social Studies", teacher: "Amit Kumar", room: "Room 201", start: 660, end: 705 },
    { time: "11:45 - 12:30", subject: "Computer", teacher: "Neha Gupta", room: "Computer Lab", start: 705, end: 750 },
    { time: "12:30 - 13:15", subject: "Lunch Break", teacher: "—", room: "School Cafeteria", start: 750, end: 795 },
    { time: "13:15 - 14:00", subject: "Hindi", teacher: "Sunita Devi", room: "Room 201", start: 795, end: 840 },
  ],
  Tuesday: [
    { time: "08:30 - 09:15", subject: "English", teacher: "Priya Sharma", room: "Room 201", start: 510, end: 555 },
    { time: "09:15 - 10:00", subject: "Mathematics", teacher: "Rahul Verma", room: "Room 201", start: 555, end: 600 },
    { time: "10:00 - 10:15", subject: "Short Break", teacher: "—", room: "School Campus", start: 600, end: 615 },
    { time: "10:15 - 11:00", subject: "Hindi", teacher: "Sunita Devi", room: "Room 201", start: 615, end: 660 },
    { time: "11:00 - 11:45", subject: "Science", teacher: "Anjali Singh", room: "Lab 1", start: 660, end: 705 },
    { time: "11:45 - 12:30", subject: "Physical Education", teacher: "Vikas Singh", room: "Playground", start: 705, end: 750 },
    { time: "12:30 - 13:15", subject: "Lunch Break", teacher: "—", room: "School Cafeteria", start: 750, end: 795 },
    { time: "13:15 - 14:00", subject: "Computer", teacher: "Neha Gupta", room: "Computer Lab", start: 795, end: 840 },
  ],
  Wednesday: [
    { time: "08:30 - 09:15", subject: "Science", teacher: "Anjali Singh", room: "Lab 1", start: 510, end: 555 },
    { time: "09:15 - 10:00", subject: "Mathematics", teacher: "Rahul Verma", room: "Room 201", start: 555, end: 600 },
    { time: "10:00 - 10:15", subject: "Short Break", teacher: "—", room: "School Campus", start: 600, end: 615 },
    { time: "10:15 - 11:00", subject: "English", teacher: "Priya Sharma", room: "Room 201", start: 615, end: 660 },
    { time: "11:00 - 11:45", subject: "Computer", teacher: "Neha Gupta", room: "Computer Lab", start: 660, end: 705 },
    { time: "11:45 - 12:30", subject: "Hindi", teacher: "Sunita Devi", room: "Room 201", start: 705, end: 750 },
    { time: "12:30 - 13:15", subject: "Lunch Break", teacher: "—", room: "School Cafeteria", start: 750, end: 795 },
    { time: "13:15 - 14:00", subject: "Social Studies", teacher: "Amit Kumar", room: "Room 201", start: 795, end: 840 },
  ],
  Thursday: [
    { time: "08:30 - 09:15", subject: "Mathematics", teacher: "Rahul Verma", room: "Room 201", start: 510, end: 555 },
    { time: "09:15 - 10:00", subject: "Science", teacher: "Anjali Singh", room: "Lab 1", start: 555, end: 600 },
    { time: "10:00 - 10:15", subject: "Short Break", teacher: "—", room: "School Campus", start: 600, end: 615 },
    { time: "10:15 - 11:00", subject: "Social Studies", teacher: "Amit Kumar", room: "Room 201", start: 615, end: 660 },
    { time: "11:00 - 11:45", subject: "English", teacher: "Priya Sharma", room: "Room 201", start: 660, end: 705 },
    { time: "11:45 - 12:30", subject: "Computer", teacher: "Neha Gupta", room: "Computer Lab", start: 705, end: 750 },
    { time: "12:30 - 13:15", subject: "Lunch Break", teacher: "—", room: "School Cafeteria", start: 750, end: 795 },
    { time: "13:15 - 14:00", subject: "Art & Craft", teacher: "Meena Kumari", room: "Art Room", start: 795, end: 840 },
  ],
  Friday: [
    { time: "08:30 - 09:15", subject: "Hindi", teacher: "Sunita Devi", room: "Room 201", start: 510, end: 555 },
    { time: "09:15 - 10:00", subject: "Mathematics", teacher: "Rahul Verma", room: "Room 201", start: 555, end: 600 },
    { time: "10:00 - 10:15", subject: "Short Break", teacher: "—", room: "School Campus", start: 600, end: 615 },
    { time: "10:15 - 11:00", subject: "Science", teacher: "Anjali Singh", room: "Lab 1", start: 615, end: 660 },
    { time: "11:00 - 11:45", subject: "English", teacher: "Priya Sharma", room: "Room 201", start: 660, end: 705 },
    { time: "11:45 - 12:30", subject: "Social Studies", teacher: "Amit Kumar", room: "Room 201", start: 705, end: 750 },
    { time: "12:30 - 13:15", subject: "Lunch Break", teacher: "—", room: "School Cafeteria", start: 750, end: 795 },
    { time: "13:15 - 14:00", subject: "Physical Education", teacher: "Vikas Singh", room: "Playground", start: 795, end: 840 },
  ],
};

const subjectColors: Record<string, string> = {
  Mathematics: "border-blue-400 bg-blue-50",
  English: "border-purple-400 bg-purple-50",
  Science: "border-green-400 bg-green-50",
  "Social Studies": "border-orange-400 bg-orange-50",
  Computer: "border-indigo-400 bg-indigo-50",
  Hindi: "border-pink-400 bg-pink-50",
  "Physical Education": "border-teal-400 bg-teal-50",
  "Art & Craft": "border-amber-400 bg-amber-50",
  "Short Break": "border-gray-300 bg-gray-50",
  "Lunch Break": "border-gray-300 bg-gray-50",
};

export default function ParentTimetable() {
  const [selectedStudent, setSelectedStudent] = useState("Aarav Sharma");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const dayIndex = weekDays.indexOf(selectedDay);
  const dayEntries = useMemo(() => timetable[selectedDay] ?? [], [selectedDay]);

  const subjectsCount = dayEntries.filter(
    (entry) => entry.subject !== "Short Break" && entry.subject !== "Lunch Break",
  ).length;

  const goToDay = (direction: number) => {
    const nextIndex = Math.max(0, Math.min(weekDays.length - 1, dayIndex + direction));
    setSelectedDay(weekDays[nextIndex]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your child's weekly class schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
            <UserRound size={20} />
          </div>
          <div>
            <label htmlFor="student" className="block text-xs text-gray-500">
              Select Child
            </label>
            <select
              id="student"
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
              className="mt-1 bg-transparent text-sm font-semibold text-gray-900 outline-none"
            >
              <option value="Aarav Sharma">Aarav Sharma · Class 8-A</option>
              <option value="Anaya Sharma">Anaya Sharma · Class 5-B</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Selected Day</p>
              <p className="mt-2 text-xl font-bold text-gray-900">{selectedDay}</p>
            </div>
            <CalendarDays size={25} className="text-blue-600" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Teaching Periods</p>
              <p className="mt-2 text-xl font-bold text-gray-900">{subjectsCount}</p>
            </div>
            <BookOpen size={25} className="text-purple-600" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">School Hours</p>
              <p className="mt-2 text-xl font-bold text-gray-900">8:30 AM – 2:00 PM</p>
            </div>
            <Clock size={25} className="text-green-600" />
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">Weekly Schedule</h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStudent} · {selectedStudent === "Aarav Sharma" ? "Class 8-A" : "Class 5-B"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToDay(-1)}
              disabled={dayIndex === 0}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous day"
            >
              <ChevronLeft size={19} />
            </button>
            <span className="min-w-24 text-center text-sm font-semibold text-gray-800">
              {selectedDay}
            </span>
            <button
              onClick={() => goToDay(1)}
              disabled={dayIndex === weekDays.length - 1}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next day"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`min-w-24 rounded-lg px-4 py-3 text-sm font-medium transition ${
                selectedDay === day
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {dayEntries.map((entry, index) => {
            const isBreak =
              entry.subject === "Short Break" || entry.subject === "Lunch Break";

            return (
              <div
                key={`${selectedDay}-${entry.subject}-${index}`}
                className={`flex flex-col gap-3 rounded-xl border-l-4 p-4 sm:flex-row sm:items-center ${
                  subjectColors[entry.subject] ?? "border-blue-400 bg-blue-50"
                }`}
              >
                <div className="flex min-w-36 items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock size={16} className="shrink-0 text-gray-500" />
                  {entry.time}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">{entry.subject}</h3>
                  {!isBreak && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <UserRound size={15} />
                      {entry.teacher}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 sm:min-w-36 sm:justify-end">
                  <MapPin size={16} className="shrink-0 text-gray-500" />
                  {entry.room}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-gray-400">
          Demo timetable. Both children currently share the same sample schedule.
          Actual schedules should be loaded according to each child's class.
        </p>
      </section>
    </div>
  );
}