import os
import shutil
import sqlite3

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPTS_DIR)
WORKSPACE_DIR = os.path.dirname(BACKEND_DIR)

PUBLIC_UPLOADS_DIR = os.path.join(WORKSPACE_DIR, "public", "uploads")
PRIVATE_STORAGE_DIR = os.path.join(BACKEND_DIR, "storage", "resumes")
DB_PATH = os.path.join(BACKEND_DIR, "copilot.db")

def migrate():
    os.makedirs(PRIVATE_STORAGE_DIR, exist_ok=True)

    if not os.path.exists(PUBLIC_UPLOADS_DIR):
        print("No public uploads directory found.")
        return

    files = os.listdir(PUBLIC_UPLOADS_DIR)
    print(f"Found {len(files)} files in public/uploads/.")

    migrated_count = 0
    for filename in files:
        src = os.path.join(PUBLIC_UPLOADS_DIR, filename)
        dst = os.path.join(PRIVATE_STORAGE_DIR, filename)

        if os.path.isfile(src):
            shutil.move(src, dst)
            print(f"Moved {filename} -> {dst}")
            migrated_count += 1

    # Update database records if copilot.db exists
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT id, resume_url FROM candidate_applications WHERE resume_url LIKE '/uploads/%'")
            rows = cursor.fetchall()
            print(f"Updating {len(rows)} database records in candidate_applications...")

            for row in rows:
                app_id, old_url = row
                new_url = old_url.replace("/uploads/", "resumes/")
                cursor.execute("UPDATE candidate_applications SET resume_url = ? WHERE id = ?", (new_url, app_id))
                print(f"Updated application {app_id}: {old_url} -> {new_url}")

            conn.commit()
            conn.close()
        except Exception as err:
            print(f"DB update note: {err}")

    print(f"Migration completed cleanly. Migrated {migrated_count} files.")

if __name__ == "__main__":
    migrate()
