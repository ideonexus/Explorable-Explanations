using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Molecules3D
{
	public class MolReader
	{
		private readonly LineReader lineReader;

		public MolReader(Func<TextReader> source)
		{
			lineReader = new LineReader(source);
		}

		public IEnumerable<Tuple<double, double, double, string>> AtomData
		{
			get
			{
				var counts = lineReader.Skip(3)
									   .First()
									   .Split(new char[0], StringSplitOptions.RemoveEmptyEntries);

				var atomCount = int.Parse(counts[0]);

				return lineReader.Skip(4)
								 .Take(atomCount)
								 .Select(line =>
								 {
									 var data = line.Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
									 return Tuple.Create(double.Parse(data[0]), double.Parse(data[1]), double.Parse(data[2]), data[3]);
								 });
			}
		}

		public IEnumerable<Tuple<int, int, int>> BondData
		{
			get
			{
				var counts = lineReader.Skip(3)
									   .First()
									   .Split(new char[0], StringSplitOptions.RemoveEmptyEntries);

				var atomCount = int.Parse(counts[0]);
				var bondCount = int.Parse(counts[1]);

				return lineReader.Skip(4 + atomCount)
								 .Take(bondCount)
								 .Select(line =>
								 {
									 var data = line.Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
									 return Tuple.Create(int.Parse(data[0]) - 1, int.Parse(data[1]) - 1, int.Parse(data[2]));
								 });
			}
		}
	}
}