package constant

type ReviewStatus string

var (
	OpenRequest    ReviewStatus = "open"            // after create request
	PendingReview  ReviewStatus = "pending-review"  // after add reviewer
	StartingReview ReviewStatus = "starting-review" // reviewer start review
	PendingChange  ReviewStatus = "pending-change"  // reviewer require creator change in question
	StartingChange ReviewStatus = "starting-change"
	Accepted       ReviewStatus = "accepted"        // reviewer accept review
	Rejected       ReviewStatus = "rejected"        // reviewer reject review
	Closed         ReviewStatus = "closed"          // creator closed review
)
