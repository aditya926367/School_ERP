function TwoFactorVerification() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Two-Factor Verification
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit code from your authenticator app.
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="mt-6 w-full rounded-lg border px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:ring-2"
        />

        <button className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white">
          Verify
        </button>

        <button className="mt-4 w-full text-sm text-blue-600">
          Use another method
        </button>
      </div>
    </div>
  )
}

export default TwoFactorVerification