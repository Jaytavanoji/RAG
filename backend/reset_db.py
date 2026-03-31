from sqlalchemy import text
from app.database import engine, Base
from app.models import *

def reset_db():
    print("Connecting to database...")
    with engine.connect() as conn:
        print("Wiping all tables with CASCADE...")
        # Get all table names in the public schema
        result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'"))
        tables = [row[0] for row in result]
        
        if tables:
            for table in tables:
                print(f"Dropping table {table} CASCADE...")
                conn.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE'))
            conn.commit()
            print("All tables dropped.")
        else:
            print("No tables found to drop.")

    print("Recreating tables from current models...")
    Base.metadata.create_all(bind=engine)
    print("Database fully reset and synchronized.")

if __name__ == "__main__":
    try:
        reset_db()
    except Exception as e:
        print(f"Error resetting database: {e}")
