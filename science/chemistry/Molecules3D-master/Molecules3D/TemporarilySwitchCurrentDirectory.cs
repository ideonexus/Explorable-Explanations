using System;
using System.IO;

namespace Molecules3D
{
	public class TemporarilySwitchCurrentDirectory : IDisposable
	{
		private readonly string currentDirectory = Environment.CurrentDirectory;

		public TemporarilySwitchCurrentDirectory(DirectoryInfo newDirectory)
		{
			Environment.CurrentDirectory = newDirectory.FullName;
		}

		public void Dispose()
		{
			Environment.CurrentDirectory = currentDirectory;
		}
	}

}