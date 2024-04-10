export const ParseProperty = (model, enumItems, boolItem) => {
  const modelRaw = JSON.parse(JSON.stringify(model))
  const dataType = modelRaw.dataType
  if (dataType.type == 'enum') {
    dataType.specs = {}
    enumItems.forEach((ei) => {
      dataType.specs[ei.value] = ei.name
    })
  } else if (dataType.type == 'bool') {
    dataType.specs = {
      '0': boolItem._true,
      '1': boolItem._false,
    }
  } else if (dataType.type == 'int32') {
    dataType.specs = {
      min: dataType.specs['min'],
      max: dataType.specs['max'],
    }
  } else if (dataType.type == 'float') {
    dataType.specs = {
      min: dataType.specs['min'],
      max: dataType.specs['max'],
      precision: dataType.specs['precision'],
    }
  } else if (dataType.type == 'text') {
    dataType.specs = {
      length: dataType.specs['length'],
    }
  } else if (dataType.type == 'position') {
    dataType.specs = {
      locateType: dataType.specs.locateType,
    }
  } else {
    dataType.specs = {}
  }

  const property = {
    description: modelRaw.description,
    unit: modelRaw.unit,
    identifier: modelRaw.identifier,
    name: modelRaw.name,
    dataType: dataType,
    accessMode: modelRaw.accessMode || 'r',
  }
  return property
}
