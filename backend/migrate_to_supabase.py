import os
import sys
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker

# SQLite local connection
SQLITE_URL = "sqlite:///./copilot.db"
# Supabase PostgreSQL connection
SUPABASE_URL = "postgresql://postgres.jcgdgqyhohiagltwctuw:Orangeblue%4012345678901@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

print("Starting SQLite to Supabase data migration...")
sys.stdout.flush()

try:
    # Initialize engines
    sqlite_engine = create_engine(SQLITE_URL)
    supabase_engine = create_engine(SUPABASE_URL)
    
    sqlite_metadata = MetaData()
    sqlite_metadata.reflect(bind=sqlite_engine)
    
    supabase_metadata = MetaData()
    supabase_metadata.reflect(bind=supabase_engine)
    
    # Session setup
    SqliteSession = sessionmaker(bind=sqlite_engine)
    SupabaseSession = sessionmaker(bind=supabase_engine)
    
    sqlite_session = SqliteSession()
    supabase_session = SupabaseSession()
    
    # Table list in dependency order (reverse for deletion, forward for insertion)
    tables_order = [
        "bidding_companies",
        "portal_users",
        "tenders",
        "bidder_sessions",
        "chat_history"
    ]
    
    # 1. Clear Supabase tables (reverse order)
    print("Clearing existing test data on Supabase...")
    sys.stdout.flush()
    for table_name in reversed(tables_order):
        if table_name in supabase_metadata.tables:
            table = supabase_metadata.tables[table_name]
            supabase_session.execute(table.delete())
            print(f"  Cleared table: {table_name}")
            sys.stdout.flush()
    supabase_session.commit()
    
    # 2. Migrate data (forward order)
    print("\nCopying data from local SQLite to Supabase...")
    sys.stdout.flush()
    for table_name in tables_order:
        if table_name in sqlite_metadata.tables and table_name in supabase_metadata.tables:
            sqlite_table = sqlite_metadata.tables[table_name]
            supabase_table = supabase_metadata.tables[table_name]
            
            # Fetch all rows from SQLite
            rows = sqlite_session.execute(sqlite_table.select()).fetchall()
            row_dicts = [dict(row._mapping) for row in rows]
            
            if row_dicts:
                # Insert into Supabase
                supabase_session.execute(supabase_table.insert(), row_dicts)
                print(f"  Migrated {len(row_dicts)} records to table: {table_name}")
            else:
                print(f"  Table: {table_name} is empty in local database.")
            sys.stdout.flush()
            
    supabase_session.commit()
    print("\nMigration completed successfully!")
    sys.stdout.flush()

except Exception as e:
    print(f"\nMigration failed: {e}")
    sys.stdout.flush()
    sys.exit(1)
finally:
    if 'sqlite_session' in locals():
        sqlite_session.close()
    if 'supabase_session' in locals():
        supabase_session.close()
