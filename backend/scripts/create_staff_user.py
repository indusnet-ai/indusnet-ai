import sys
import os
import getpass

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db import SessionLocal
from app import models
from app.routers.auth import get_password_hash

def create_staff_user():
    print("=" * 50)
    print("Indusnet AI — Create Staff User CLI Utility")
    print("=" * 50)

    db = SessionLocal()
    try:
        email = input("Enter staff email: ").strip()
        if not email:
            print("Error: Email cannot be empty.")
            return

        existing = db.query(models.PortalUser).filter(models.PortalUser.email == email).first()
        if existing:
            print(f"Error: User with email '{email}' already exists (role: {existing.role}).")
            return

        name = input("Enter staff full name: ").strip() or email.split("@")[0].title()

        print("\nSelect Role:")
        print("1. Internal Evaluator (internal_evaluator)")
        print("2. HR Manager (hr_manager)")
        role_choice = input("Choice (1 or 2): ").strip()

        if role_choice == "1":
            role = models.UserRole.INTERNAL_EVALUATOR.value
        elif role_choice == "2":
            role = models.UserRole.HR_MANAGER.value
        else:
            print("Invalid choice. Exiting.")
            return

        password = getpass.getpass("Enter password (min 6 chars): ")
        if len(password) < 6:
            print("Error: Password must be at least 6 characters.")
            return

        confirm = getpass.getpass("Confirm password: ")
        if password != confirm:
            print("Error: Passwords do not match.")
            return

        hashed = get_password_hash(password)
        staff_user = models.PortalUser(
            email=email,
            password_hash=hashed,
            role=role,
            name=name
        )
        db.add(staff_user)
        db.commit()
        db.refresh(staff_user)

        print("-" * 50)
        print(f"Success! Created staff account:")
        print(f"  ID:    {staff_user.id}")
        print(f"  Email: {staff_user.email}")
        print(f"  Name:  {staff_user.name}")
        print(f"  Role:  {staff_user.role}")
        print("-" * 50)
    finally:
        db.close()

if __name__ == "__main__":
    create_staff_user()
