# How you can contribute to Open Access Vis

Please create an [issue](https://github.com/steveharoz/open-access-vis/issues) to:

* Add missing data
* Fix incorrect data
* Add thumbnails (a missing thumbnail or a better version of an existing one)

Please do not edit the CSV via a pull request. For data updates, only use issues.

**Important: Do not retrieve any information from IEEE (especially abstracts and thumbnails). Everything should come from other sources.**

## URLs:

* URLs on an open access repository are prioritized for longevity.
* White-listed open access repositories are in the `OADomains` variable in [js/load.js](../js/load.js#L12). Let me know if others should be added.
* For URLs outside of an open access repository, it must be on the site of an author or their institution.
* The paper must be viewable directly in a browser without any required download.

## Explanation page:

The explanation page is for sites that contain more than the basic information. It's not simply a "landing page", and it includes a simpler description of the project and/or a demo. Good examples:

* [Timecurves](http://www.aviz.fr/~bbach/timecurves/)
* [Timelines Revisited](https://timelinesrevisited.github.io/)
* [Isotype Visualization](http://steveharoz.com/research/isotype/) (blatent self promotion)

## Thumbnails

* The image must be exactly 400 x 300 pixels.
* Try to find a figure that is explanatory rather than just eye candy.
* The filename is the first non-article word in the title + `"_"` + first name of first author + `".png"` (all lower case).  
For example, "A Nifty Vis System" by Jane Smith and John Smith would become `nifty_jane.png`

For now, thumbnails are not in the repository. Feel free to paste new ones into a github issue or email them to me.

## Videos

* Prioritize explanatory videos rather than teasers or eye candy.
* Videos on Youtube, Vimeo, or hosted as an MP4 should all work.
* Youtube spreadsheet format: `youtube VIDEO_ID`. For example `youtube Xj-AEmUwsvQ`
* Vimeo spreadsheet format: `vimeo VIDEO_ID`. For example `vimeo 223373844`
* Video file spreadsheet format: `video VIDEO_URL`.  For example  
`video http://timelinesrevisited.github.io/supplemental/stories/routines.mp4`  
If the video file is hosted on a personal domain (not github), ask for permission before using.
