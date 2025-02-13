import BrowseBenefitWrapper from "../wrappers/BrowseBenefitWrapper";
import BrowseCityWrapper from "../wrappers/BrowseCityWrapper";
import BrowseHeader from "../wrappers/BrowseHeader";
import BrowseOfficeWraper from "../wrappers/BrowseOfficeWraper";

export default function Browse() {
  return (
    <>
      <BrowseHeader />

      <BrowseCityWrapper />

      <BrowseBenefitWrapper />

      <BrowseOfficeWraper />
    </>
  );
}
