namespace exercise3;

public static class IntelRadar
{
    // -1=infinite, 0/1/2 = numar intersectii; se compara distanta^2 pentru precizie
    public static int possiblePoints(long x1, long y1, long r1, long x2, long y2, long r2)
    {
        long dx = x1 - x2;
        long dy = y1 - y2;
        // distanta^2 intre centre
        long d2 = dx * dx + dy * dy;

        if (d2 == 0)
        {
            return r1 == r2 ? -1 : 0;
        }

        long sum = (r1 + r2) * (r1 + r2);
        long diff = (r1 - r2) * (r1 - r2);

        if (d2 > sum) return 0; // centre prea departate (fara intersectii)
        if (d2 < diff) return 0; // unul in interiorul celuilalt fara atingere
        if (d2 == sum || d2 == diff) return 1; // tangent (atingere)
        return 2; // doua puncte de intersectie
    }
}
