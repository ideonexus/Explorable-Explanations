using OpenBabel;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;

namespace Molecules3D
{
    public class MoleculeBuilder
    {
		private IEnumerable<Tuple<double, double, double, string>> atomData;
		private IEnumerable<Tuple<int, int, int>> bondData;

        public MoleculeBuilder FromSmiles(string smiles)
        {
			var builder = new StringBuilder();

			// Switch the current directory to the application's bin directory so
			// it can find all the related Open Babel files
			using(new TemporarilySwitchCurrentDirectory(new DirectoryInfo(AppDomain.CurrentDomain.RelativeSearchPath)))
			{
				var process = new Process
				{
					StartInfo =
					{
						FileName = @".\obabel.exe",
						Arguments = string.Format("-:\"{0}\" -omol --gen3d", smiles),
						UseShellExecute = false,
						RedirectStandardOutput = true
					}
				};

				process.OutputDataReceived += (sender, args) => builder.AppendLine(args.Data);
				process.Start();
				process.BeginOutputReadLine();
				process.WaitForExit();
			}

			var mol = builder.ToString();
			var reader = new MolReader(() => new StringReader(mol));

			atomData = reader.AtomData;
			bondData = reader.BondData;

            return this;
        }

	    public MoleculeBuilder Centralize()
	    {
			var atomList = atomData.ToList();

			var xOffset = (atomList.Min(a => a.Item1) + atomList.Max(a => a.Item1)) / 2.0;
			var yOffset = (atomList.Min(a => a.Item2) + atomList.Max(a => a.Item2)) / 2.0;
			var zOffset = (atomList.Min(a => a.Item3) + atomList.Max(a => a.Item3)) / 2.0;

			atomData = atomList.Select(a => Tuple.Create(a.Item1 - xOffset, a.Item2 - yOffset, a.Item3 - zOffset, a.Item4));

			return this;
	    }

        public MoleculeDto ToDto()
        {
			var result = new MoleculeDto
			{
				Atoms = atomData.Select(x => new AtomDto(x.Item1, x.Item2, x.Item3, x.Item4.GetElementColor()))
			};

			result.Bonds = bondData.Select(x =>
			{
				var from = result.Atoms.ElementAt(x.Item1);
				var to = result.Atoms.ElementAt(x.Item2);

				return new BondDto(from.X, from.Y, from.Z, to.X, to.Y, to.Z, x.Item3);
			});

			return result;
		}
    }
}