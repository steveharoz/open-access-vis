# How you can contribute to Open Access Vis

Please create an [issue](https://github.com/steveharoz/open-access-vis/issues) to:

* Add missing data
* Fix incorrect data
* Add thumbnails (a missing thumbnail or a better version of an existing one)

**Important: Do not retrieve any information from IEEE (especially abstracts and thumbnails). Everything should come from other sources.**

## Adding or modifying the data:

The data is pulled from [this google spreadsheet](https://docs.google.com/spreadsheets/d/11ZNUflBnK47ljl_g0NVJFntP1xb8qsSv-PcpinoeWRw/edit?usp=sharing) into [openaccessvis.csv](openaccessvis.csv). To make a change, put the info in a new github [issue](https://github.com/steveharoz/open-access-vis/issues).

## URLs:

* URLs on an open access repository are prioritized for longevity.
* White-listed open access repositories are in the `OADomains` variable in [js/load.js](../js/load.js#L12). Let me know if others should be added.
* For URLs outside of an open access repository, it must be on the site of an author or their institution.
* The paper must be viewable directly in a browser without any required download.

## Thumbnails

* The filename is the first non-article word in the title + `"_"` + first name of first author + `".png"` (all lower case).  
For example, "A Nifty Vis System" by Jane Smith and John Smith would become `nifty_jane.png`
* The image should be 400 x 300 pixels.
* Try to find a figure that is explanatory rather than just eye candy.

For now, thumbnails are not in the repository. Feel free to email me new ones.

## Videos

* Prioritize explanatory videos rather than teasers or eye candy.
* Videos on Youtube, Vimeo, or hosted as an MP4 should all work.
* Youtube spreadsheet format: `[youtube VIDEO_ID]`. For example `youtube Xj-AEmUwsvQ`
* Vimeo spreadsheet format: `[vimeo VIDEO_ID]`. For example `vimeo 223373844`
* Video file spreadsheet format: `[video VIDEO_URL]`.  For example  
`video http://timelinesrevisited.github.io/supplemental/stories/routines.mp4`  
If the video file is hosted on a personal domain (not github), ask for permission before using.