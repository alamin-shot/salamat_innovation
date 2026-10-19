import { CustomSelect } from "@/components/ui/CustomSelect";

export function PeopleAddressFields({ manager }: { manager: any }) {
    const countries = ["Bangladesh"];
    const districts = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna"];
    const areas = ["Bashundhara", "Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Banani"];

    return (
        <div className="flex flex-col gap-5 pt-2">
            <h3 className="text-sm font-bold text-gray-800">Address</h3>

            {/* Row 1: Country, District, Area via CustomSelect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Country</label>
                    <CustomSelect
                        value={manager.country}
                        onChange={manager.setCountry}
                        options={countries}
                        placeholder="Choose a Country"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">District</label>
                    <CustomSelect
                        value={manager.district}
                        onChange={manager.setDistrict}
                        options={districts}
                        placeholder="Select District"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Area</label>
                    <CustomSelect
                        value={manager.area}
                        onChange={manager.setArea}
                        options={areas}
                        placeholder="Select Area"
                    />
                </div>
            </div>

            {/* Row 2: Thana, Postal Code, Street Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Thana</label>
                    <input
                        type="text"
                        placeholder="Enter Thana"
                        value={manager.thana}
                        onChange={(e) => manager.setThana(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Postal Code</label>
                    <input
                        type="text"
                        placeholder="Enter Postal Code"
                        value={manager.postalCode}
                        onChange={(e) => manager.setPostalCode(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Street Address</label>
                    <input
                        type="text"
                        placeholder="Enter Your Street Address"
                        value={manager.streetAddress}
                        onChange={(e) => manager.setStreetAddress(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}