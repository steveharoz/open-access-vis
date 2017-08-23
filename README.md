# How you can contribute to Open Access Vis

Please create an [issue](https://github.com/steveharoz/open-access-vis/issues) for:

* Missing data
* Incorrect data
* Video links (almost all are missing)
* Thumbnails (a missing thumbnail or a better version of an existing one)

**Important: Do not retrieve any information from (especially abstracts and thumbnails) from IEEE. Everything should come from other sources.**

## URLs:

* URLs on an open access repository are prioritized for longevity.
* White-listed open access repositories are in the `OADomains` variable in [js/load.js](js/load.js#L10). Let me know if others should be added.

## Adding or modifying the data:

The data is stored in [openaccessvis.csv](openaccessvis.csv), but don't edit it directly. The file will be pulled from [this google spreadsheet](https://docs.google.com/spreadsheets/d/11ZNUflBnK47ljl_g0NVJFntP1xb8qsSv-PcpinoeWRw/edit?usp=sharing). To make a change, you can either make a comment on the spreadsheet or put the info in a new issue.

## Thumbnails

* The filename is the first non-article word in the title + `"_"` + first name of first author + `".png"` (all lower case).  
For example, "A Nifty Vis System" by Jane Smith and John Smith would become `nifty_jane.png`
* The image should be 400 x 300 pixels.
* Try to find a figure that is explanatory rather than just eye candy.

For now, thumbnails are not in the repository. Feel free to email me new ones.

## Videos

* Videos on Youtube, Vimeo, or hosted as an MP4 should all work.
* Youtube spreadsheet format: `[youtube VIDEO_ID]`. For example `youtube Xj-AEmUwsvQ`
* Vimeo spreadsheet format: `[vimeo VIDEO_ID]`. For example `vimeo 223373844`
* Video file spreadsheet format: `[video VIDEO_URL]`. For example `video http://timelinesrevisited.github.io/supplemental/stories/routines.mp4`  
If the video file is hosted on a personal domain (not github), ask for permission before using.