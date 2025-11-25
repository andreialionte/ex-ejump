namespace exercise3;

class Program
{
    static void Main(string[] args)
    {
        var tests = new (long x1, long y1, long r1, long x2, long y2, long r2, int expect)[]
        {
            (0,0,13, 40,0,37, 2),
            (0,0,3, 0,7,4, 1),
            (0,0,5, 10,10,3, 0),
            (0,0,1, 0,0,1, -1),
        };

        foreach (var t in tests)
        {
            int got = IntelRadar.possiblePoints(t.x1, t.y1, t.r1, t.x2, t.y2, t.r2);
            Console.WriteLine($"Input: ({t.x1},{t.y1},{t.r1}) / ({t.x2},{t.y2},{t.r2}) => output {got}, expect {t.expect} => {(got==t.expect?"OK":"FAIL")}");
        }
    }
}
