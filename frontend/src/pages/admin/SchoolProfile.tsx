import {
  School,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
  Upload,
  Image,
  PenLine,
  Stamp,
  FileText,
} from "lucide-react";

function SchoolProfile() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          School Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your school's information and official branding.
        </p>
      </div>

      {/* Basic School Information */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
            <School size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              School Information
            </h2>
            <p className="text-sm text-gray-500">
              Basic details about your school
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          {/* School Name */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              School Name
            </label>

            <input
              type="text"
              defaultValue="Delhi Public School"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>

          {/* School Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              School Code
            </label>

            <input
              type="text"
              defaultValue="DPS-RKP"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>

          {/* Affiliation */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Board / Affiliation
            </label>

            <select
              defaultValue="CBSE"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin size={16} />
              Address
            </label>

            <textarea
              rows={3}
              defaultValue="R. K. Puram, New Delhi, Delhi - 110022"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone size={16} />
              Contact Number
            </label>

            <input
              type="tel"
              defaultValue="+91 11 1234 5678"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail size={16} />
              Email Address
            </label>

            <input
              type="email"
              defaultValue="info@school.edu.in"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Globe size={16} />
              Website
            </label>

            <input
              type="url"
              defaultValue="https://www.school.edu.in"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10"
            />
          </div>
        </div>
      </div>

      {/* School Branding */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
            <Image size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              School Branding
            </h2>
            <p className="text-sm text-gray-500">
              Manage official school logo, signature, stamp and letterhead
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* School Logo */}
          <div className="rounded-lg border border-gray-200 p-5">
            <div className="mb-4 flex items-center gap-3">
              <Image size={19} className="text-[#27348b]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  School Logo
                </h3>
                <p className="text-xs text-gray-500">
                  PNG, JPG or SVG
                </p>
              </div>
            </div>

            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <Upload
                  size={28}
                  className="mx-auto mb-2 text-gray-400"
                />
                <p className="text-sm text-gray-600">
                  Upload School Logo
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Maximum size 2 MB
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-[#27348b] px-4 py-2 text-sm font-medium text-[#27348b] transition hover:bg-[#27348b]/5"
            >
              Choose Logo
            </button>
          </div>

          {/* Signature */}
          <div className="rounded-lg border border-gray-200 p-5">
            <div className="mb-4 flex items-center gap-3">
              <PenLine size={19} className="text-[#27348b]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Authorized Signature
                </h3>
                <p className="text-xs text-gray-500">
                  Principal / Authorized person
                </p>
              </div>
            </div>

            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <Upload
                  size={28}
                  className="mx-auto mb-2 text-gray-400"
                />
                <p className="text-sm text-gray-600">
                  Upload Signature
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PNG or JPG
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-[#27348b] px-4 py-2 text-sm font-medium text-[#27348b] transition hover:bg-[#27348b]/5"
            >
              Choose Signature
            </button>
          </div>

          {/* School Stamp */}
          <div className="rounded-lg border border-gray-200 p-5">
            <div className="mb-4 flex items-center gap-3">
              <Stamp size={19} className="text-[#27348b]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  School Stamp
                </h3>
                <p className="text-xs text-gray-500">
                  Official school stamp
                </p>
              </div>
            </div>

            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <Upload
                  size={28}
                  className="mx-auto mb-2 text-gray-400"
                />
                <p className="text-sm text-gray-600">
                  Upload School Stamp
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PNG or JPG
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-[#27348b] px-4 py-2 text-sm font-medium text-[#27348b] transition hover:bg-[#27348b]/5"
            >
              Choose Stamp
            </button>
          </div>

          {/* Letterhead */}
          <div className="rounded-lg border border-gray-200 p-5">
            <div className="mb-4 flex items-center gap-3">
              <FileText size={19} className="text-[#27348b]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Official Letterhead
                </h3>
                <p className="text-xs text-gray-500">
                  Used for official documents
                </p>
              </div>
            </div>

            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <Upload
                  size={28}
                  className="mx-auto mb-2 text-gray-400"
                />
                <p className="text-sm text-gray-600">
                  Upload Letterhead
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PDF, PNG or JPG
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-[#27348b] px-4 py-2 text-sm font-medium text-[#27348b] transition hover:bg-[#27348b]/5"
            >
              Choose Letterhead
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[#27348b] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70]"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SchoolProfile;