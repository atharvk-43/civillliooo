"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Star, Flag, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react"

interface AccountabilityFeedback {
  id: string
  rating: number
  comment: string
  date: string
  upvotes: number
}

interface DemocrativeAccountabilityProps {
  grievanceId: string
  status: string
  onSubmitFeedback?: (feedback: { rating: number; comment: string }) => Promise<void>
  existingFeedback?: AccountabilityFeedback[]
  allowAppeal?: boolean
}

export function DemocraticAccountability({
  grievanceId,
  status,
  onSubmitFeedback,
  existingFeedback = [],
  allowAppeal = true,
}: DemocrativeAccountabilityProps) {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showAppealForm, setShowAppealForm] = useState(false)
  const [appealReason, setAppealReason] = useState("")

  const handleSubmitFeedback = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide both a rating and comment")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmitFeedback?.({ rating, comment })
      setSubmitted(true)
      setRating(0)
      setComment("")
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">Democratic Accountability</h3>
        <p className="text-sm text-muted-foreground">
          Hold administrators accountable. Your feedback directly impacts performance ratings and future decisions.
        </p>
      </div>

      {/* Feedback Form */}
      <Card className="p-6 border border-border">
        <h4 className="font-semibold text-foreground mb-4">Rate Your Experience</h4>

        {/* Star Rating */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">How would you rate the handling of your grievance?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {rating === 5
                ? "Excellent"
                : rating === 4
                  ? "Good"
                  : rating === 3
                    ? "Acceptable"
                    : rating === 2
                      ? "Poor"
                      : "Very Poor"}{" "}
              - {rating}/5 stars
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">Your Feedback</label>
          <Textarea
            placeholder="Share your experience with how your grievance was handled. What went well? What could be improved?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-32 bg-background"
          />
          <p className="text-xs text-muted-foreground mt-1">{comment.length}/500 characters</p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitFeedback}
          disabled={isSubmitting || !rating || !comment.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : submitted ? "Feedback Submitted!" : "Submit Feedback"}
        </Button>

        {submitted && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              Thank you for your feedback! This helps us improve our governance and accountability.
            </p>
          </div>
        )}
      </Card>

      {/* Existing Feedback */}
      {existingFeedback.length > 0 && (
        <div>
          <h4 className="font-semibold text-foreground mb-4">Community Feedback</h4>
          <div className="space-y-4">
            {existingFeedback.map((feedback) => (
              <Card key={feedback.id} className="p-4 border border-border">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= feedback.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{feedback.date}</span>
                </div>
                <p className="text-sm text-foreground mb-3">{feedback.comment}</p>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{feedback.upvotes} found this helpful</span>
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Appeal Mechanism */}
      {allowAppeal && status !== "Resolved" && (
        <Card className="p-6 border-2 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Appeal or Escalate</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                Disagree with how your grievance is being handled? You have the right to appeal. Your concern will be
                reviewed by a higher authority.
              </p>

              {!showAppealForm ? (
                <Button
                  onClick={() => setShowAppealForm(true)}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-700"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  File an Appeal
                </Button>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Explain why you are appealing this decision or requesting escalation..."
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    className="min-h-24 bg-white dark:bg-gray-950"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // Handle appeal submission
                        console.log("Appeal submitted:", appealReason)
                        setShowAppealForm(false)
                        setAppealReason("")
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Submit Appeal
                    </Button>
                    <Button variant="outline" onClick={() => setShowAppealForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Information Box */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How Accountability Works</h4>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex gap-2">
            <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Your Feedback:</strong> Directly influences performance ratings of administrators and government
              officials
            </span>
          </li>
          <li className="flex gap-2">
            <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Public Transparency:</strong> Ratings and feedback are published to inform community decisions
            </span>
          </li>
          <li className="flex gap-2">
            <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Appeal Rights:</strong> You can challenge decisions and request higher-level review at any time
            </span>
          </li>
          <li className="flex gap-2">
            <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Action Items:</strong> Low ratings trigger mandatory improvement plans from departments
            </span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
