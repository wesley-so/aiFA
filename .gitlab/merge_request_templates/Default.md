### What does the MR do?

<!--
Please keep this description updated with any discussion that takes place so
that reviewers can understand your intent. Keeping the description updated is
especially important if they didn't participate in the discussion.
-->

### Screenshots

<!--
For UI/UX only, remove this part if not.

Please include any relevant screenshots or screen recordings that will assist
reviewers and future readers. If you need help visually verifying the change,
please leave a comment and ping a GitLab reviewer, maintainer, or MR coach.
-->

## How to set up and validate locally

<!--
Numbered steps to set up and validate the change are strongly suggested.

Example below:

1. Enable the invite modal
   ```ruby
   Feature.enable(:invite_members_group_modal)
   ```
1. In rails console enable the experiment fully
   ```ruby
   Feature.enable(:member_areas_of_focus)
   ```
1. Visit any group or project member pages such as `http://127.0.0.1:3000/groups/flightjs/-/group_members`
1. Click the `invite members` button.
-->

### Relevant links

<!--
Optional section

Information that the developer might need to refer to when implementing the issue:
- Feature issue links
- story issue links
- other related links
-->

<!--
Label remainders

Merge request will default remove ~"status::" scoped labels and assign to the 
creaters themselves.
Add more labels if needed.
-->
/unlabel ~"status::in progress" ~"status::in review"
/assign me
