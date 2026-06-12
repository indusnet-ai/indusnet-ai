import sqlite3

conn = sqlite3.connect('backend/copilot.db')
c = conn.cursor()

c.execute("SELECT id, session_id, sender, message, created_at FROM chat_history WHERE created_at > '2026-06-12 12:51:00' ORDER BY created_at ASC")
rows = c.fetchall()

print(f"Total messages created since server start: {len(rows)}")
for r in rows:
    print(f"\n==========================================")
    print(f"[{r[2].upper()}] - {r[4]} (Session ID: {r[1]})")
    print(f"==========================================")
    # Print first 500 characters of the message to keep it readable
    msg_preview = r[3][:500] + "..." if len(r[3]) > 500 else r[3]
    print(msg_preview)
