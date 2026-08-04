using System;
using System.Security.Cryptography;
using System.Text;

namespace InterviewApi.Utils
{
    public class PasswordHasher
    {
        // Generate a random salt
        private static string GenerateSalt(int size = 16)
        {
            var rng = new RNGCryptoServiceProvider();
            var saltBytes = new byte[size];
            rng.GetBytes(saltBytes);
            return Convert.ToBase64String(saltBytes);
        }

        // Hash password with salt
        public static string HashPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password cannot be empty.");

            var salt = GenerateSalt();
            var saltedPassword = password + salt;

            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                var hash = Convert.ToBase64String(bytes);
                // Store as: {salt}:{hash}
                return $"{salt}:{hash}";
            }
        }

        // Verify hashed password
        public static bool VerifyPassword(string enteredPassword, string storedSaltedHash)
        {
            var parts = storedSaltedHash.Split(':');
            if (parts.Length != 2) return false;

            var salt = parts[0];
            var hash = parts[1];

            using (SHA256 sha256 = SHA256.Create())
            {
                var saltedPassword = enteredPassword + salt;
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                var enteredHash = Convert.ToBase64String(bytes);
                return enteredHash == hash;
            }
        }
    }
}