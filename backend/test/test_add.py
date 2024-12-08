import unittest
from unittest.mock import MagicMock, patch

# Walidacja
def insert_reservation(cursor, user_id, room_id, reservation_date, reservation_time, created_at):
    if not isinstance(user_id, int):
        raise ValueError(f"user_id powinien być typu int, a otrzymano {type(user_id)}")
    if not isinstance(room_id, int):
        raise ValueError(f"room_id powinien być typu int, a otrzymano {type(room_id)}")

    try:
        reservation_date = str(reservation_date)  
    except ValueError:
        raise ValueError(f"reservation_date musi być poprawnym typem DATE, otrzymano {type(reservation_date)}")

    if not isinstance(reservation_time, str) or len(reservation_time) != 5:
        raise ValueError(f"reservation_time powinien być typu string i mieć długość 5 znaków, otrzymano {reservation_time}")

    try:
        created_at = str(created_at) 
    except ValueError:
        raise ValueError(f"created_at musi być poprawnym typem TIMESTAMP, otrzymano {type(created_at)}")

    cursor.execute("""
        INSERT INTO reservation (user_id, room_id, reservation_date, reservation_time, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, room_id, reservation_date, reservation_time, created_at))

class TestReservation(unittest.TestCase):
    @patch('psycopg2.connect') 
    def test_insert_reservation(self, mock_connect):

        mock_cursor = MagicMock()

    
        mock_connection = MagicMock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        # Przykładowe dane
        user_id = 1  
        room_id = 10 
        reservation_date = '2024-12-07'  
        reservation_time = '14:00'  
        created_at = '2024-12-07 12:00:00' 

        insert_reservation(mock_cursor, user_id, room_id, reservation_date, reservation_time, created_at)


        expected_query = """
            INSERT INTO reservation (user_id, room_id, reservation_date, reservation_time, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """.strip().replace(" ", "").replace("\n", "")
        
        actual_query = mock_cursor.execute.call_args[0][0].strip().replace(" ", "").replace("\n", "")
        
 
        self.assertEqual(expected_query, actual_query)

  
        self.assertEqual(mock_cursor.execute.call_args[0][1], (user_id, room_id, reservation_date, reservation_time, created_at))

if __name__ == '__main__':
    unittest.main()
