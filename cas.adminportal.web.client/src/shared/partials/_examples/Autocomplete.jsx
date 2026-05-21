import { Breadcrumb } from "@shared/components/_examples/custom/breadcrumb/Breadcrumb";
import { Autocomplete as MUIAutocomplete } from "@shared/components/_examples/custom/fields/Autocomplete";
import { AutocompleteMock } from "@shared/mock/FieldMock";

export const Autocomplete = ({ component }) => {
	return (
		<>
			<section className="space-y-8">
				<header className="space-y-1">
					<h5 className="text-xl font-bold">{component}</h5>
					<Breadcrumb component={component} />
				</header>

				<MUIAutocomplete mock={AutocompleteMock} />
			</section>
		</>
	);
};
