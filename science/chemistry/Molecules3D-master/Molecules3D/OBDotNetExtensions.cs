using System.Drawing;
using System.Linq;
using OpenBabel;

namespace Molecules3D
{
	public static class OBDotNetExtensions
	{
		private static readonly OBElementTable obElementTable = new OBElementTable();

		public static int GetElementColor(this string element)
		{
			var rgb = obElementTable.GetRGB(obElementTable.GetAtomicNum(element))
				                    .Select(x => (int)(x * 255))
									.ToArray();

			return Color.FromArgb(0, rgb[0], rgb[1], rgb[2]).ToArgb();
		}
	}
}
