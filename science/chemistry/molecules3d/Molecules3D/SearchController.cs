using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web.Http;

namespace Molecules3D
{
	public class SearchController : ApiController
	{
		public MoleculeDto Post([FromBody] string searchTerm)
		{
			return new MoleculeBuilder().FromSmiles(searchTerm)
										.Centralize()
										.ToDto();
		}
	}
}