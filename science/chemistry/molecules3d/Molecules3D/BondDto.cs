using System.Runtime.Serialization;

namespace Molecules3D
{
	[DataContract]
	public class BondDto
	{
		public BondDto(double fromX, double fromY, double fromZ, double toX, double toY, double toZ, int bondOrder)
		{
			this.FromX = fromX;
			this.FromY = fromY;
			this.FromZ = fromZ;
			this.ToX = toX;
			this.ToY = toY;
			this.ToZ = toZ;
			this.BondOrder = bondOrder;
		}

		[DataMember]
		public double FromX { get; set; }

		[DataMember]
		public double FromY { get; set; }

		[DataMember]
		public double FromZ { get; set; }

		[DataMember]
		public double ToX { get; set; }

		[DataMember]
		public double ToY { get; set; }

		[DataMember]
		public double ToZ { get; set; }

		[DataMember]
		public int BondOrder { get; set; }
	}
}