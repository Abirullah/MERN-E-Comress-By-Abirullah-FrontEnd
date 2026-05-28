export default function AddressForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="first-name" className="text-sm font-semibold text-slate-800">
          First name
        </label>
        <input
          id="first-name"
          name="first-name"
          type="text"
          autoComplete="given-name"
          placeholder="John"
          className="field-input"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="last-name" className="text-sm font-semibold text-slate-800">
          Last name
        </label>
        <input
          id="last-name"
          name="last-name"
          type="text"
          autoComplete="family-name"
          placeholder="Snow"
          className="field-input"
          required
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="address1" className="text-sm font-semibold text-slate-800">
          Address line 1
        </label>
        <input
          id="address1"
          name="address1"
          type="text"
          autoComplete="shipping address-line1"
          placeholder="Street name and number"
          className="field-input"
          required
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="address2" className="text-sm font-semibold text-slate-800">
          Address line 2
        </label>
        <input
          id="address2"
          name="address2"
          type="text"
          autoComplete="shipping address-line2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          className="field-input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="city" className="text-sm font-semibold text-slate-800">
          City
        </label>
        <input
          id="city"
          name="city"
          type="text"
          autoComplete="address-level2"
          placeholder="New York"
          className="field-input"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="state" className="text-sm font-semibold text-slate-800">
          State
        </label>
        <input
          id="state"
          name="state"
          type="text"
          autoComplete="address-level1"
          placeholder="NY"
          className="field-input"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="zip" className="text-sm font-semibold text-slate-800">
          Zip / Postal code
        </label>
        <input
          id="zip"
          name="zip"
          type="text"
          autoComplete="shipping postal-code"
          placeholder="12345"
          className="field-input"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="country" className="text-sm font-semibold text-slate-800">
          Country
        </label>
        <input
          id="country"
          name="country"
          type="text"
          autoComplete="shipping country-name"
          placeholder="United States"
          className="field-input"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="inline-flex items-center gap-3 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
          Use this address for payment details
        </label>
      </div>
    </div>
  );
}
