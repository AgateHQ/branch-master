import { Group, Text, Avatar } from "@mantine/core";
import { useState } from "react";
import styles from "../styles/Comments.module.css";

const MOCK_COMMENTS = [
  {
    id: 1,
    authorName: "Sarah Mitchell",
    authorUrl: "https://twitter.com/sarahmitchell",
    avatarUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%236366f1' width='40' height='40' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='10'%3ESM%3C/text%3E%3C/svg%3E",
    timestamp: "Oct 12, 2024",
    content:
      "This guide was incredibly helpful! I've been struggling with implementing a paywall that doesn't hurt conversion. The metered approach section really opened my eyes.",
    replies: 3,
    isEdited: false,
  },
  {
    id: 2,
    authorName: "James Chen",
    authorUrl: null,
    avatarUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%2310b981' width='40' height='40' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='10'%3EJC%3C/text%3E%3C/svg%3E",
    timestamp: "Oct 13, 2024",
    content:
      "The technical resilience section is key. We experienced a payment processor outage last month and had our paywall fail for 4 hours - losing customers in the process.",
    replies: 1,
    isEdited: false,
  },
  {
    id: 3,
    authorName: "Elena Rodriguez",
    authorUrl: "https://twitter.com/elenarodriguez",
    avatarUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23f97316' width='40' height='40' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='10'%3ERR%3C/text%3E%3C/svg%3E",
    timestamp: "Oct 14, 2024",
    content:
      "Question about the preview height settings - what do you recommend for long-form investigative pieces versus short opinion columns? We have a mix of content types.",
    replies: 2,
    isEdited: false,
  },
  {
    id: 4,
    authorName: "Michael Park",
    authorUrl: null,
    avatarUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23ef4444' width='40' height='40' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='10'%3EMP%3C/text%3E%3C/svg%3E",
    timestamp: "Oct 15, 2024",
    content:
      "Great article! We're planning to implement a tiered paywall system soon. Would love to see a follow-up on dynamic pricing strategies.",
    replies: 0,
    isEdited: true,
  },
];

function Comments() {
  const [likedCommentIds, setLikedCommentIds] = useState(() => new Set());

  const toggleLike = (id) => {
    setLikedCommentIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className={styles.section}>
      <Group gap="12px" mb="var(--mantine-spacing-xl)">
        <Text component="h2" fw={700} size="lg" m={0}>
          Comments ({MOCK_COMMENTS.length})
        </Text>
      </Group>

      {/* Comment form */}
      <div className={styles.form}>
        <Text c="dimmed" size="sm">
          Leave a comment
        </Text>
        <div className={styles.formInputs}>
          <input
            type="text"
            placeholder="Name (optional)"
            className={styles.input}
            aria-label="Name"
          />
          <input
            type="email"
            placeholder="Email (won't be published)"
            className={styles.input}
            aria-label="Email"
          />
          <textarea
            placeholder="Write your comment..."
            className={styles.textarea}
            aria-label="Comment"
            rows={3}
          />
        </div>
        <button type="button" className={styles.submitButton}>
          Post Comment
        </button>
      </div>

      {/* Comments list */}
      <div className={styles.list}>
        {MOCK_COMMENTS.map((comment) => (
          <article key={comment.id} className={styles.comment}>
            <header className={styles.commentHeader}>
              <Group gap="8px" style={{ marginBottom: "0.5rem" }}>
                {comment.avatarUrl && (
                  <Avatar
                    src={comment.avatarUrl}
                    alt=""
                    size="sm"
                    radius="md"
                  />
                )}
                <div>
                  <Text fw={600}>{comment.authorName}</Text>
                  {comment.timestamp && (
                    <Text c="dimmed" size="xs">
                      {comment.timestamp}
                      {comment.isEdited && " · Edited"}
                    </Text>
                  )}
                </div>
              </Group>

              <div className={styles.commentContent}>
                <Text>{comment.content}</Text>
              </div>

              <footer className={styles.commentFooter}>
                <Group gap="8px">
                  <button
                    type="button"
                    className={styles.actionButton}
                    aria-label={`Reply to ${comment.authorName}`}
                  >
                    Reply{comment.replies > 0 ? ` (${comment.replies})` : ""}
                  </button>
                  <button
                    type="button"
                    className={styles.actionButton}
                    aria-pressed={likedCommentIds.has(comment.id)}
                    onClick={() => toggleLike(comment.id)}
                  >
                    Like
                  </button>
                  <button
                    type="button"
                    className={styles.actionButton}
                    aria-label={`Report comment by ${comment.authorName}`}
                  >
                    Report
                  </button>
                </Group>
              </footer>
            </header>

            {/* Reply box */}
            {comment.replies > 0 && (
              <div className={styles.replyBox}>
                <Text c="dimmed" size="xs" mb="var(--mantine-spacing-xs)">
                  Write a reply
                </Text>
                <div className={styles.replyInputs}>
                  <input
                    type="text"
                    placeholder="Name (optional)"
                    className={styles.input}
                    aria-label="Reply name"
                  />
                  <textarea
                    placeholder="Write your reply..."
                    className={styles.textarea}
                    aria-label="Reply content"
                    rows={2}
                  />
                </div>
                <button type="button" className={styles.submitButton}>
                  Reply
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Comments;
