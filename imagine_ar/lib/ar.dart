import 'package:arcore_flutter_plugin/arcore_flutter_plugin.dart';
import 'package:flutter/material.dart';
// import 'package:arcore_flutter_plugin/arcore_flutter_plugin.dart';
import 'package:vector_math/vector_math_64.dart' as vector;

// class ArPage extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text("Demo 2"),
//       ),
//       body: Container()
//     );
//   }
// }

class ArPage extends StatefulWidget {
  ArPage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyArPageState createState() => _MyArPageState();
}

class _MyArPageState extends State<ArPage> {
  ArCoreController arCoreController;

  _onArCoreViewCreated(ArCoreController _arCoreController) {
    arCoreController = _arCoreController;
    _addSphere(arCoreController);
  }

  _addSphere(ArCoreController _arCoreController) {
    final material = ArCoreMaterial(color: Colors.deepOrange);
    final sphere = ArCoreSphere(materials: [material], radius: 0.2);
    final node = ArCoreNode(shape: sphere, position: vector.Vector3(0, 0, -1),);
    _arCoreController.addArCoreNode(node);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Ar Page"),
      ),
      body: ArCoreView(onArCoreViewCreated: _onArCoreViewCreated,),
    );
  }
}
