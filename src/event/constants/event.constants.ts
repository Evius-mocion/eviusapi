import { ILandingSection, LandingSectionTitles } from "src/types/event.type";

export const defaultLandingSections: ILandingSection[] = [
  {
    title: LandingSectionTitles.Counter,
    visible: true,
  },
  {
    title: LandingSectionTitles.Description,
    visible: false,
  },
  {
    title: LandingSectionTitles.Speakers,
    visible: false,
  },
  {
    title: LandingSectionTitles.Activities,
    visible: false,
  },
  {
    title: LandingSectionTitles.Sponsors,
    visible: false,
  },
];
