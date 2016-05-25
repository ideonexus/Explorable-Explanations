using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;

namespace Molecules3D
{
	public class LineReader : IEnumerable<string>
	{
		private readonly Func<TextReader> readerSource;

		public LineReader(Func<TextReader> readerSource)
		{
			this.readerSource = readerSource;
		}

		public IEnumerator<string> GetEnumerator()
		{
			using (TextReader reader = readerSource())
			{
				string line;
				while ((line = reader.ReadLine()) != null)
				{
					yield return line;
				}
			}
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			return GetEnumerator();
		}
	}
}